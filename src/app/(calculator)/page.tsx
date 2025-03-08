"use client";
import { useState } from "react";
import { Chart } from "./_components/chart";
import { ComponentForm } from "./_components/component-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, DollarSign, RefreshCw } from "lucide-react";
import { DataTable } from "./_components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export default function CompoundInterestPage() {
  const [data, setData] = useState<CalculationOutput>();
  const [isLoadingData, setIsLoadingData] = useState(false);

  const exportToExcel = () => {
    if (!data) return;

    const worksheet = XLSX.utils.json_to_sheet(data.results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Juros Compostos");

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Mês", "Juros", "Total Investido", "Total Juros", "Total Acumulado"]],
      { origin: "A1" }
    );

    XLSX.writeFile(workbook, "juros_compostos.xlsx");
  };

  return (
    <section>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full max-w-5xl">
          <div className="container grid max-w-full">
            <h1 className="text-lg font-semibold mb-4">
              Calculadora de juros compostos
            </h1>
            <Card>
              <CardContent className="p-4">
                <ComponentForm
                  setIsLoadingData={setIsLoadingData}
                  setData={setData}
                />
              </CardContent>
            </Card>

            <div className="mt-4">
              {isLoadingData ? (
                <div className="flex gap-2 items-center">
                  <RefreshCw className="animate-spin" size={18} />
                  Carregando...
                </div>
              ) : (
                <div>
                  {data && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Valor Total Investido
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-primary" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold">
                              {data.totalInvested}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Total em juros
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-teal-500" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold">
                              {data.totalInterest}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Valor Total Final
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-cyan-500" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold">
                              {data.totalAccumulated}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardContent className="p-4">
                          <Tabs defaultValue="tab-1" className="items-center">
                            <div className="flex items-center">
                              <TabsList>
                                <TabsTrigger value="tab-1">Gráfico</TabsTrigger>
                                <TabsTrigger value="tab-2">Tabela</TabsTrigger>
                              </TabsList>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={exportToExcel}
                                      className="rounded-lg ml-auto"
                                      variant="outline"
                                      size="icon"
                                      aria-label="Baixar Excel"
                                    >
                                      <ArrowDownToLine
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Faça download dos dados</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <TabsContent value="tab-1" className="h-96">
                              <Chart data={data} />
                            </TabsContent>
                            <TabsContent value="tab-2" className="min-h-96">
                              <div className="[&>div]:max-h-96 max-w-full">
                                <DataTable data={data} />
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
