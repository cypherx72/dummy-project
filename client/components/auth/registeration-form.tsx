"use client";

import { FaRegHandPointLeft } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { OTPSchema, RegistrationSchema } from "@/config/ZodSchema";
import { formatTime } from "@/lib/general-utils";
import { CombinedGraphQLErrors, gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { errorToast, showToast } from "../ui/toast";
import { useRouter } from "next/navigation";

type OTPValues = z.infer<typeof otpSchema>;
type RegistrationValues = z.infer<typeof registrationSchema>;

const registrationSchema = RegistrationSchema();
const otpSchema = OTPSchema();

const countryCodes = [
  {
    name: "india",
    code: "+91",
  },
  {
    name: "zimbabwe",
    code: "+263",
  },
];

const SEND_OTP_MUTATION = gql`
  mutation SendOTP($contactNumber: String!, $registrationId: String!) {
    sendOTP: SendOTP(
      input: { contactNumber: $contactNumber, registrationId: $registrationId }
    ) {
      status
      message
      code
    }
  }
`;

type SendOTPResponse = {
  sendOTP: {
    status: number;
    code: string;
    message: string;
  };
};

type VerifyOTPResponse = {
  verifyOTP: {
    status: number;
    code: string;
    message: string;
  };
};

const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOTP(
    $contactNumber: String!
    $registrationId: String!
    $userOTP: String!
  ) {
    verifyOTP: VerifyOTP(
      input: {
        contactNumber: $contactNumber
        registrationId: $registrationId
        userOTP: $userOTP
      }
    ) {
      status
      message
      code
    }
  }
`;

export default function RegistrationForm() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<
    "registrationId" | "otpVerification"
  >("registrationId");

  const [sendOTP, { loading: sendOTPLoading, data: sendOTPData }] =
    useMutation<SendOTPResponse>(SEND_OTP_MUTATION);
  const [verifyOTP, { loading: verifyOTPLoading, data: verifyOTPData }] =
    useMutation<VerifyOTPResponse>(VERIFY_OTP_MUTATION);

  // Registration form
  const registrationForm = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { registrationId: "", countryCode: "", mobileNumber: "" },
  });

  // OTP form
  const OTPform = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { pin: "" },
  });

  // Handle Registration submit
  async function onSubmitRegistration(values: RegistrationValues) {
    const registrationId = values.registrationId;
    const contactNumber = `${values.countryCode}${values.mobileNumber}`;

    const variables = {
      contactNumber,
      registrationId,
    };

    try {
      const { data } = await sendOTP({ variables });

      if (data?.sendOTP.status === 200) {
        showToast("OTP", data.sendOTP.message, "success");
        setActiveTab("otpVerification");

        setTimeLeft(30);
        registrationForm.reset(values);
      }
    } catch (err) {
      if (err instanceof CombinedGraphQLErrors) {
        return showToast("OTP", err.message, "error");
      }

      return errorToast();
    }
  }
  // Handle OTP submit
  async function onSubmitOTP(values: OTPValues) {
    const userOTP = values.pin.toString();
    const contactNumber =
      registrationForm.getValues("countryCode") +
      registrationForm.getValues("mobileNumber");
    const registrationId = registrationForm.getValues("registrationId");

    const variables = {
      userOTP,
      contactNumber,
      registrationId,
    };

    try {
      const { data } = await verifyOTP({ variables });

      if (data?.verifyOTP.status === 200) {
        showToast("OTP", data.verifyOTP.message, "success");
        router.push("/auth/signin");
      }
    } catch (err) {
      if (err instanceof CombinedGraphQLErrors) {
        return showToast("OTP", err.message, "warning");
      }

      return errorToast();
    }
  }

  // Timer for resend
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger
            value="registrationId"
            disabled={activeTab === "otpVerification"}
          >
            Registration
          </TabsTrigger>
          <TabsTrigger
            value="otpVerification"
            disabled={activeTab === "registrationId"}
          >
            Verify OTP
          </TabsTrigger>
        </TabsList>

        {/* Registration Form */}
        <TabsContent value="registrationId">
          <Form {...registrationForm}>
            <form
              onSubmit={registrationForm.handleSubmit(onSubmitRegistration)}
            >
              <Card className="p-4 py-8">
                <CardHeader>
                  <CardTitle>Secure your Account</CardTitle>
                  <CardDescription>
                    Already registered? Click here to{" "}
                    <Link href="/auth/login" className="underline">
                      log in.
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="gap-6 grid">
                  <FormField
                    control={registrationForm.control}
                    name="registrationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-start items-start gap-3 w-full">
                    <FormField
                      control={registrationForm.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="flex-1/3">
                          <FormLabel>CC</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="p-1.5 w-full">
                              <SelectValue placeholder="--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Country Code</SelectLabel>
                                {countryCodes.map((country) => (
                                  <SelectItem
                                    value={country.code}
                                    key={country.code}
                                  >
                                    <Image
                                      src={`/svg/${country.name}.svg`}
                                      height={12}
                                      width={12}
                                      alt={`${country.name} country code`}
                                    />
                                    <p className="">{country.code}</p>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem className="flex-2/3">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={
                      sendOTPLoading || sendOTPData?.sendOTP.status === 200
                    }
                    className="font-black text-md leading-3"
                  >
                    {sendOTPLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        {/* OTP Verification */}
        <TabsContent value="otpVerification">
          <Card>
            <CardHeader>
              <CardTitle>OTP</CardTitle>
              <CardDescription>
                Enter the one-time password sent to your phone.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6 grid">
              <Form {...OTPform}>
                <form
                  onSubmit={OTPform.handleSubmit(onSubmitOTP)}
                  className="space-y-6 w-full"
                >
                  <FormField
                    control={OTPform.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              {[...Array(6)].map((_, i) => (
                                <InputOTPSlot key={i} index={i} />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col justify-start items-start gap-4 font-semibold text-sm">
                    <Link
                      onClick={() => setActiveTab("registrationId")}
                      href="#"
                      className="text-white/60 underline"
                    >
                      <span className="flex flex-rol justify-center items-center gap-1">
                        <FaRegHandPointLeft className="text-orange-400" />
                        Back to Edit
                      </span>
                    </Link>
                    <span className="flex items-center gap-1">
                      <Button
                        onClick={() => {
                          onSubmitRegistration({
                            registrationId:
                              registrationForm.getValues("registrationId"),
                            countryCode:
                              registrationForm.getValues("countryCode"),
                            mobileNumber:
                              registrationForm.getValues("mobileNumber"),
                          });
                        }}
                        variant="secondary"
                        type="button"
                        disabled={timeLeft !== 0 || sendOTPLoading}
                        className="p-2 text-neutral-900 dark:text-white leading-2"
                      >
                        {sendOTPLoading ? "Resending OTP " : "Resend OTP "}
                      </Button>
                      {sendOTPLoading ? null : (
                        <span>
                          in <span>{formatTime(timeLeft)}</span>
                        </span>
                      )}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      verifyOTPLoading ||
                      verifyOTPData?.verifyOTP.status === 200
                    }
                    className="font-black leading-3"
                  >
                    {verifyOTPLoading ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// todo: Implement errors ojbect returned from graphql
