// todo: refer to styles in the global css, this is for implementing a discussion forum usign a threaded
// todo: tree structure like, it will take time to implement....
export default function AboutPage() {
  return (
    <>
      <ul className="tree">
        <li className="parent">
          <details open className="details">
            <summary>
              <span className="label">string</span>Level 1
            </summary>
            <ul className="nested-list">
              <li className="nested-item">
                {" "}
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                {" "}
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                {" "}
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                {" "}
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                {" "}
                <span className="label">string</span>Demo
              </li>
            </ul>
          </details>
        </li>
        <li className="parent">
          <details className="details">
            <summary>
              <span className="label">string</span>Level 1
            </summary>
            <ul className="nested-list">
              <li className="nested-item">
                <details>
                  <summary>
                    <span className="label">string</span>
                    Level 2
                  </summary>
                  <ul className="nested-list">
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                    <li className="nested-item">
                      <span className="label">string</span>Demo
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
        </li>
        <li className="parent">
          <details className="details">
            <summary>
              <span className="label">string</span>Level 1
            </summary>
            <ul className="nested-list">
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
            </ul>
          </details>
        </li>
        <li className="parent">
          <details className="details">
            <summary>
              <span className="label">string</span>Level 1
            </summary>
            <ul className="nested-list">
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
              <li className="nested-item">
                <span className="label">string</span>Demo
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </>
  );
}
