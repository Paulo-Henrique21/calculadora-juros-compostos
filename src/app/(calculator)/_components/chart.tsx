import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config";

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

interface CustomTooltipFormatterContext {
  x: number;
  points?: {
    color: string;
    series: {
      name: string;
    };
    y?: number;
  }[];
}

const parseCurrency = (value: string): number => {
  return parseFloat(
    value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
  );
};

const formatCurrency = (value: number | undefined): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);
};

export function Chart({ data }: { data: CalculationOutput }) {
  const fullConfig = resolveConfig(tailwindConfig).theme.colors;

  const months = data.results.map((item) => `${item.month}`);

  const interestData = data.results.map((item) =>
    parseCurrency(item.totalInterest)
  );
  const investedData = data.results.map((item) =>
    parseCurrency(item.totalInvested)
  );

  const options = {
    chart: {
      type: "column",
      style: {
        fontFamily: "Inter",
        fontSize: "12px",
        // color: fullConfig.muted.foreground,
      },
      backgroundColor: fullConfig.background,
    },
    title: {
      text: "",
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: fullConfig.foreground,
        fontSize: "12px",
      },
      itemHoverStyle: {
        color: fullConfig.muted.foreground,
      },
      align: "center",
      verticalAlign: "top",
    },
    xAxis: {
      lineWidth: 0,
      tickWidth: 0,
      categories: months,
      title: {
        text: "Meses",
        style: {
          color: fullConfig.muted.foreground,
        },
      },
      labels: {
        style: {
          color: fullConfig.muted.foreground,
        },
      },
    },
    yAxis: {
      title: {
        text: "Valores em (R$)",
        style: {
          color: fullConfig.muted.foreground,
        },
      },
      labels: {
        style: {
          color: fullConfig.muted.foreground,
        },
      },
      gridLineColor: fullConfig.secondary.DEFAULT,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: fullConfig.background,
      shadow: {
        color: "rgba(0, 0, 0, 0.1)",
        offsetX: 2,
        offsetY: 2,
        opacity: 0.15,
        width: 4,
      },
      borderColor: fullConfig.border,
      borderWidth: 1,
      borderRadius: 8,
      style: {
        fontSize: "12px",
        color: fullConfig.foreground,
        padding: "8px",
      },
      formatter: function (this: CustomTooltipFormatterContext) {
        const mesTexto = this.x === 0 ? "Início" : `${this.x}º Mês`;

        let tooltipText = `<span style="display: block; margin-bottom: 4px; font-size: 12px; font-weight: 600; color: ${fullConfig.foreground};">${mesTexto}</span>`;

        tooltipText += `<table style="width: 100%; border-collapse: collapse;">`;

        this.points?.forEach((point) => {
          tooltipText += `
            <tr style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 2px 0; gap: 12px;">
                <td style="display: flex; align-items: center; gap: 6px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: ${
                      point.color
                    }; border-radius: 2px;"></span>
                    <span style="font-size: 12px; color: ${
                      fullConfig.muted.foreground
                    };">${point.series.name}</span>
                </td>
                <td style="text-align: right; font-size: 12px; font-weight: 600; padding-left: 12px; color: ${
                  fullConfig.foreground
                };">
                    ${formatCurrency(point.y)}
                </td>
            </tr>
            `;
        });

        // Pegando o total acumulado do mesmo índice que o tooltip está mostrando
        const totalAcumulado = formatCurrency(
          parseCurrency(data.results[this.x].totalAccumulated)
        );

        tooltipText += `
            <tr style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: bold; color: ${fullConfig.foreground}; padding-top: 6px; border-top: 1px solid ${fullConfig.border}; margin-top: 6px;">
                <td style="text-align: left;">Total</td>
                <td style="text-align: right;">${totalAcumulado}</td>
            </tr>
        `;

        tooltipText += `</table>`;
        return tooltipText;
      },
    },

    series: [
      {
        name: "Valor em Juros",
        data: interestData,
        color: fullConfig.teal[500],
      },
      {
        name: "Valor Investido",
        data: investedData,
        color: fullConfig.primary.DEFAULT,
      },
      // {
      //   name: "Total Acumulado",
      //   data: accumulatedData,
      //   color: fullConfig.blue[800],
      // },
    ],
  };

  return (
    <div className="w-full relative h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{
          className: "h-full w-full absolute",
        }}
      />
    </div>
  );
}
