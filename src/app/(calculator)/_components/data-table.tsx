import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function DataTable({ data }: { data: CalculationOutput }) {
  return (
    <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
      <TableHeader className="bg-background sticky top-0 z-10 backdrop-blur-xs">
        <TableRow className="hover:bg-transparent">
          <TableHead>Mês</TableHead>
          <TableHead>Juros</TableHead>
          <TableHead>Total Investido</TableHead>
          <TableHead>Total Juros</TableHead>
          <TableHead className="text-right">Total Acumulado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.results.map((item) => (
          <TableRow key={item.month}>
            <TableCell className="font-medium">{item.month}</TableCell>
            <TableCell>{item.interest}</TableCell>
            <TableCell>{item.totalInvested}</TableCell>
            <TableCell>{item.totalInterest}</TableCell>
            <TableCell className="text-right">
              {item.totalAccumulated}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
