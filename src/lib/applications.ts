import { createServerFn } from "@tanstack/react-start";
import { sql } from "@/lib/db";

export type LoanApplicationInput = {
  reference: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  loanAmount: string;
  income: string;
  employment: string;
  loanTerm: string;
};

export const saveLoanApplication = createServerFn({ method: "POST" })
  .inputValidator((data: LoanApplicationInput) => data)
  .handler(async ({ data }) => {
    const db = sql();
    await db`
      insert into loan_applications (
        reference,
        first_name,
        last_name,
        id_number,
        phone,
        loan_amount,
        monthly_income,
        employment,
        loan_term,
        status
      )
      values (
        ${data.reference},
        ${data.firstName},
        ${data.lastName},
        ${data.idNumber},
        ${data.phone},
        ${data.loanAmount},
        ${Number(data.income)},
        ${data.employment},
        ${data.loanTerm},
        'submitted'
      )
      on conflict (reference) do update set
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        id_number = excluded.id_number,
        phone = excluded.phone,
        loan_amount = excluded.loan_amount,
        monthly_income = excluded.monthly_income,
        employment = excluded.employment,
        loan_term = excluded.loan_term,
        updated_at = now()
    `;

    return { ok: true };
  });
