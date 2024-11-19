import { Command } from 'commander';
import chalk from 'chalk';
import columnify from 'columnify'
import { OBNIZ_DATA_API, FORECAST_DATA_API } from '../constants/api.js';

export const showCommand = new Command('show')
  .description('ヤオロズ農園のデータと温度・土壌湿度データを表示します')
  .option('-f, --forecast', '天気予報データを表示')
  .action(async (options) => {
    try {
      let title, columns;

      // -f or --forecast が指定されている場合は天気予報データを表示
      if (options.forecast) {
        const response = await fetch(FORECAST_DATA_API);
        const data = await response.json();
        // 最初のヘッダー行を無視して2番目のデータから処理
        const formattedData = data.slice(1).map(row => {
          // timestampから日付部分のみを抽出
          const date = row[0].split('T')[0];
          
          return {
            日付: date,
            気温: `${row[1].toFixed(1)}°C`,
            湿度: `${row[2]}%`,
            降水量: `${row[3].toFixed(1)}mm`,
            日照時間: `${row[4].toFixed(1)}h`
          };
        });

        title = chalk.greenBright('\n掛川の気象観測データ\n');
        columns = columnify(formattedData, {
          columnSplitter: ' | ',
          config: {
            日付: { align: 'left' },
            気温: { align: 'right' },
            湿度: { align: 'right' },
            降水量: { align: 'right' },
            日照時間: { align: 'right' }
          }
        });

      } else {
        const response = await fetch(OBNIZ_DATA_API);
        const data = await response.json();
        const formattedData = data.map(item => {
          const date = item.timestamp.split('T')[0];
          return {
            日付: date,
            気温: `${item.temperature.toFixed(1)}°C`,
            湿度: `${item.humidity.toFixed(1)}%`
          };
        });

        title = chalk.greenBright('\n掛川ヤオロズ農園の温度・湿度データ\n');
        columns = columnify(formattedData, {
          columnSplitter: ' | ',
          config: {
            日付: { align: 'left' },
            気温: { align: 'right' },
            湿度: { align: 'right' }
          }
        });
      }

      // タイトルとデータを表示
      console.log(title);
      console.log(columns);

    } catch (error) {
      console.error(chalk.red('データの取得に失敗しました:', error.message));
    }
});