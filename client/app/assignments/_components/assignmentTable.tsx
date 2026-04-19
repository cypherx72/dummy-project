"use client";

import { useEffect, useState } from "react";
import { columns, Payment } from "./columns";
import { DataTable } from "./dataTable";

async function getData(): Promise<Payment[]> {
  // Replace with your actual API call, e.g. fetch from your GraphQL/Prisma backend
  return [
    {
      id: "728ed52f",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "728ed52f",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "728ed52f",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "728ed52f",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "489e1d42",
      amount: 242,
      status: "success",
      email: "abe45@example.com",
    },
    {
      id: "a1b2c3d4",
      amount: 837,
      status: "processing",
      email: "monserrat44@example.com",
    },
    {
      id: "e5f6g7h8",
      amount: 874,
      status: "success",
      email: "silas22@example.com",
    },
    {
      id: "i9j0k1l2",
      amount: 721,
      status: "failed",
      email: "carmella@example.com",
    },
  ];
}

export function AssignmentsTable() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 mx-auto min-w-0 h-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
