"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type IssueStatus = "Failed" | "Ready" | "Processed";

type Issue = {
  id: number;
  order: string;
  errorMessage: string;
  createdDate: string;
  status: IssueStatus;
};

const initialIssues: Issue[] = [
  {
    id: 1,
    order: "BI115681",
    errorMessage: "Deficit of SL Unrestricted-use 13 L : A706 1110 1001",
    createdDate: "2026-04-02 08:14",
    status: "Failed",
  },
  {
    id: 2,
    order: "BI118572",
    errorMessage:
      "Posting only possible in periods 2026/04 and 2026/03 in company code 1100",
    createdDate: "2026-04-02 08:41",
    status: "Ready",
  },
  {
    id: 3,
    order: "BI113779",
    errorMessage: "Order BI123452 does not exist",
    createdDate: "2026-04-02 09:05",
    status: "Failed",
  },
  {
    id: 4,
    order: "BI114233",
    errorMessage: "Account 400100 requires an assignment to a CO object",
    createdDate: "2026-04-02 09:18",
    status: "Ready",
  },
  {
    id: 5,
    order: "BI117904",
    errorMessage: "Batch 0000001199 is blocked for goods movement",
    createdDate: "2026-04-02 09:57",
    status: "Processed",
  },
  {
    id: 6,
    order: "BI116340",
    errorMessage: "Plant 1100 is not defined for material M-88317",
    createdDate: "2026-04-02 10:12",
    status: "Ready",
  },
  {
    id: 7,
    order: "BI119015",
    errorMessage: "Storage location 1001 is locked for physical inventory",
    createdDate: "2026-04-02 10:35",
    status: "Failed",
  },
  {
    id: 8,
    order: "BI112486",
    errorMessage: "No valid cost center found for posting date 2026-04-01",
    createdDate: "2026-04-02 11:04",
    status: "Processed",
  },
  {
    id: 9,
    order: "BI111905",
    errorMessage: "Vendor 300045 has a posting block in purchasing organization 1100",
    createdDate: "2026-04-02 11:20",
    status: "Ready",
  },
  {
    id: 10,
    order: "BI120332",
    errorMessage: "Tolerance key DW exceeded during invoice verification",
    createdDate: "2026-04-02 11:58",
    status: "Failed",
  },
  {
    id: 11,
    order: "BI117221",
    errorMessage: "Exchange rate type M missing for currency pair EUR/USD",
    createdDate: "2026-04-02 12:19",
    status: "Ready",
  },
  {
    id: 12,
    order: "BI121004",
    errorMessage: "Valuation class 3000 is not maintained for material type ROH",
    createdDate: "2026-04-02 13:01",
    status: "Failed",
  },
  {
    id: 13,
    order: "BI122667",
    errorMessage: "Delivery date cannot be earlier than requested GI date",
    createdDate: "2026-04-02 13:37",
    status: "Processed",
  },
  {
    id: 14,
    order: "BI119880",
    errorMessage: "Payment terms ZB30 are not allowed for customer group INT",
    createdDate: "2026-04-02 14:05",
    status: "Ready",
  },
  {
    id: 15,
    order: "BI123901",
    errorMessage: "Material ledger is active; price determination missing for period",
    createdDate: "2026-04-02 14:29",
    status: "Failed",
  },
];

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [processedCount, setProcessedCount] = useState(
    initialIssues.filter((issue) => issue.status === "Processed").length,
  );

  const filteredIssues = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return issues;
    }

    return issues.filter(
      (issue) =>
        issue.order.toLowerCase().includes(term) ||
        issue.errorMessage.toLowerCase().includes(term),
    );
  }, [issues, search]);

  const readyCount = issues.filter((issue) => issue.status === "Ready").length;

  const processIssues = (ids: number[]) => {
    if (!ids.length) {
      return;
    }

    const idSet = new Set(ids);
    const processableCount = issues.filter((issue) => idSet.has(issue.id)).length;

    if (!processableCount) {
      return;
    }

    setIssues((current) => current.filter((issue) => !idSet.has(issue.id)));
    setProcessedCount((current) => current + processableCount);
    setSelectedRowIds((current) => current.filter((id) => !idSet.has(id)));
    setSelectedIssue((current) =>
      current && idSet.has(current.id) ? null : current,
    );
  };

  const toggleSelection = (id: number) => {
    setSelectedRowIds((current) =>
      current.includes(id)
        ? current.filter((existingId) => existingId !== id)
        : [...current, id],
    );
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>AAK Demo Issue List</h1>

      <section className={styles.kpiGrid}>
        <article className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total issues</span>
          <strong className={styles.kpiValue}>{issues.length}</strong>
        </article>
        <article className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ready to process</span>
          <strong className={styles.kpiValue}>{readyCount}</strong>
        </article>
        <article className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Processed</span>
          <strong className={styles.kpiValue}>{processedCount}</strong>
        </article>
      </section>

      <section className={styles.controls}>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by Order or Error Message"
          aria-label="Search by Order or Error Message"
        />
        <button
          className={styles.processSelectedButton}
          type="button"
          onClick={() => processIssues(selectedRowIds)}
          disabled={selectedRowIds.length === 0}
        >
          Process Selected
        </button>
      </section>

      <section className={styles.contentLayout}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxHeader} />
                <th>Order</th>
                <th>Error Message</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td className={styles.emptyRow} colSpan={6}>
                    No issues found.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue, index) => (
                  <tr
                    key={issue.id}
                    className={`${styles.tableRow} ${
                      index % 2 === 0 ? styles.rowEven : styles.rowOdd
                    }`}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <td
                      onClick={(event) => event.stopPropagation()}
                      className={styles.checkboxCell}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(issue.id)}
                        onChange={() => toggleSelection(issue.id)}
                        aria-label={`Select order ${issue.order}`}
                      />
                    </td>
                    <td>{issue.order}</td>
                    <td>{issue.errorMessage}</td>
                    <td>{issue.createdDate}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          issue.status === "Failed"
                            ? styles.statusFailed
                            : issue.status === "Ready"
                              ? styles.statusReady
                              : styles.statusProcessed
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <button
                        className={styles.processButton}
                        type="button"
                        onClick={() => processIssues([issue.id])}
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className={styles.detailPanel}>
          <h2>Issue Details</h2>
          {selectedIssue ? (
            <dl className={styles.detailList}>
              <div>
                <dt>ID</dt>
                <dd>{selectedIssue.id}</dd>
              </div>
              <div>
                <dt>Order</dt>
                <dd>{selectedIssue.order}</dd>
              </div>
              <div>
                <dt>Error Message</dt>
                <dd>{selectedIssue.errorMessage}</dd>
              </div>
              <div>
                <dt>Created Date</dt>
                <dd>{selectedIssue.createdDate}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedIssue.status}</dd>
              </div>
            </dl>
          ) : (
            <p className={styles.detailHint}>
              Click a row to view issue details.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
