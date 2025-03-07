"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  NumberField,
} from "react-aria-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculate } from "../calculate";

// Esquema de validação atualizado
const FormSchema = z.object({
  initialValue: z.number().min(0, {
    message: "Initial value must be a positive number.",
  }),
  monthlyValue: z.number().min(0, {
    message: "Monthly value must be a positive number.",
  }),
  interestRate: z.number().min(0, {
    message: "Interest rate must be a positive number.",
  }),
  interestType: z.enum(["monthly", "yearly"], {
    required_error: "Please select an interest type.",
  }),
  period: z.number().min(1, {
    message: "Period must be at least 1.",
  }),
  periodType: z.enum(["months", "years"], {
    required_error: "Please select a period type.",
  }),
});

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

export function ComponentForm({
  setIsLoadingData,
  setData,
}: {
  setIsLoadingData: (value: boolean) => void;
  setData: (data: CalculationOutput) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      initialValue: 1000,
      monthlyValue: 500,
      interestRate: 11,
      interestType: "yearly",
      period: 2,
      periodType: "years",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoadingData(true);
    setTimeout(() => {
      handleCalculate(data);
    }, 400);
  }

  async function handleCalculate(data: z.infer<typeof FormSchema>) {
    const response = calculate(data);
    setData(response);
    setIsLoadingData(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Valor Inicial */}
          <FormField
            control={form.control}
            name="initialValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Inicial</FormLabel>
                <NumberField
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  formatOptions={{
                    style: "currency",
                    currency: "BRL",
                    currencySign: "accounting",
                  }}
                  className="w-full"
                >
                  <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5">
                    <AriaInput className="w-auto bg-background px-3 py-2 tabular-nums text-foreground focus:outline-none" />
                    <div className="flex h-[calc(100%+2px)] flex-col ml-auto">
                      <AriaButton
                        slot="increment"
                        className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                      >
                        <ChevronUp
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </AriaButton>
                      <AriaButton
                        slot="decrement"
                        className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                      >
                        <ChevronDown
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </AriaButton>
                    </div>
                  </Group>
                </NumberField>
              </FormItem>
            )}
          />

          {/* Valor Mensal */}
          <FormField
            control={form.control}
            name="monthlyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Mensal</FormLabel>
                <NumberField
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  formatOptions={{
                    style: "currency",
                    currency: "BRL",
                    currencySign: "accounting",
                  }}
                  className="w-full"
                >
                  <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5">
                    <AriaInput className="w-auto bg-background px-3 py-2 tabular-nums text-foreground focus:outline-none" />
                    <div className="flex h-[calc(100%+2px)] flex-col ml-auto">
                      <AriaButton
                        slot="increment"
                        className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                      >
                        <ChevronUp
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </AriaButton>
                      <AriaButton
                        slot="decrement"
                        className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                      >
                        <ChevronDown
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </AriaButton>
                    </div>
                  </Group>
                </NumberField>
              </FormItem>
            )}
          />

          {/* Taxa de Juros + Tipo */}
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Taxa de Juros (%)</FormLabel>
                  <NumberField
                    {...field}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    className="w-full"
                  >
                   <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5">
                    <AriaInput className="w-auto bg-background px-3 py-2 tabular-nums text-foreground focus:outline-none" />
                    <div className="flex h-[calc(100%+2px)] flex-col ml-auto">
                        <AriaButton
                          slot="increment"
                          className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                        >
                          <ChevronUp
                            size={12}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </AriaButton>
                        <AriaButton
                          slot="decrement"
                          className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                        >
                          <ChevronDown
                            size={12}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </AriaButton>
                      </div>
                    </Group>
                  </NumberField>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Período + Tipo */}
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Período</FormLabel>
                  <NumberField
                    {...field}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    className="w-full"
                  >
                    <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5">
                    <AriaInput className="w-auto bg-background px-3 py-2 tabular-nums text-foreground focus:outline-none" />
                    <div className="flex h-[calc(100%+2px)] flex-col ml-auto">
                        <AriaButton
                          slot="increment"
                          className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                        >
                          <ChevronUp
                            size={12}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </AriaButton>
                        <AriaButton
                          slot="decrement"
                          className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background"
                        >
                          <ChevronDown
                            size={12}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </AriaButton>
                      </div>
                    </Group>
                  </NumberField>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="months">Meses</SelectItem>
                      <SelectItem value="years">Anos</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Calcular</Button>
      </form>
    </Form>
  );
}
