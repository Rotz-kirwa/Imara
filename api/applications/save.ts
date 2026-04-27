import postgres from "postgres";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await request.json() as {
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

    const url = process.env.DATABASE_URL;
    if (!url) return Response.json({ error: "DB not configured" }, { status: 500 });

    const sql = postgres(url, { ssl: "require", max: 1 });
    try {
      await sql`
        insert into loan_applications (
          reference, first_name, last_name, id_number, phone,
          loan_amount, monthly_income, employment, loan_term, status
        )
        values (
          ${data.reference}, ${data.firstName}, ${data.lastName}, ${data.idNumber}, ${data.phone},
          ${data.loanAmount}, ${Number(data.income)}, ${data.employment}, ${data.loanTerm}, 'submitted'
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
    } finally {
      await sql.end();
    }

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
