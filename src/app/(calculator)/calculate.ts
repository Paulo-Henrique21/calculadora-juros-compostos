interface Data {
  initialValue: number;
  monthlyValue: number;
  interestRate: number;
  interestType: "monthly" | "yearly";
  period: number;
  periodType: "months" | "years";
}

interface Result {
  month: number;
  interest: string;
  totalInvested: string;
  totalInterest: string;
  totalAccumulated: string;
}

interface CalculationOutput {
  results: Result[];
  totalInterest: string;
  totalInvested: string;
  totalAccumulated: string;
}

export function calculate(data: Data): CalculationOutput {
  const {
    initialValue,
    monthlyValue,
    interestRate,
    interestType,
    period,
    periodType,
  } = data;

  // Converter taxa de juros para mensal se necessário
  const monthlyInterestRate =
    interestType === "yearly"
      ? Math.pow(1 + interestRate / 100, 1 / 12) - 1
      : interestRate / 100;

  // Converter período para meses, se necessário
  const totalMonths = periodType === "years" ? period * 12 : period;

  let invested = initialValue;
  let accumulated = initialValue;
  let totalInterest = 0;

  const results: Result[] = [
    {
      month: 0,
      interest: formatCurrency(0),
      totalInvested: formatCurrency(invested),
      totalInterest: formatCurrency(0),
      totalAccumulated: formatCurrency(accumulated),
    },
  ];

  for (let month = 1; month <= totalMonths; month++) {
    // Primeiro, aplicamos os juros ao saldo atual ANTES do novo aporte
    const interest = accumulated * monthlyInterestRate;
    totalInterest += interest;
    accumulated += interest;

    // Agora, adicionamos o novo aporte
    invested += monthlyValue;
    accumulated += monthlyValue;

    results.push({
      month,
      interest: formatCurrency(interest),
      totalInvested: formatCurrency(invested),
      totalInterest: formatCurrency(totalInterest),
      totalAccumulated: formatCurrency(accumulated),
    });
  }

  return {
    results,
    totalInterest: formatCurrency(totalInterest),
    totalInvested: formatCurrency(invested),
    totalAccumulated: formatCurrency(accumulated),
  };
}

// Função para formatar valores monetários no padrão brasileiro
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
