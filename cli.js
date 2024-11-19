#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';
import { Command } from 'commander';
const program = new Command();

const OBNIZ_DATA_API = "https://script.google.com/macros/s/AKfycbyGaDbh9gAVRnd9-I6N-J-0KxDp4oMxdOFkbN8Dnei5UsmVQOpUDbtyT56SYhz6PjPlOg/exec ";
const FORECAST_DATA_API = "https://script.googleusercontent.com/macros/echo?user_content_key=Qodea7ES-PZ9215NHmdjJ2vwhrmxIlbbX-d9_vNXAulxGeBwDENBYT-8AoVaOuIWPCOn1irAdt36TZLcrbZStKLhzaBHrD7_m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnEJcEuDrjRC3l-RY1t0pDkGnenfGGKTew-YsvzutREMs28kgA8cD7DX8UAZo4hsFtivuoNKnzKaMALzZN475gTQTal9bDTKWGNz9Jw9Md8uu&lib=MBbd30Bbr1BQklC0LBEGv7xlqbOJza8Jo";

program
  .name('chappa')
  .description('CLI for chappa operations')
  .version('1.0.0');

  program
    .command('install')
    .description('Install something')
    .action(() => {
      console.log('Executing install command');
      const art = `
                                                                                                      
        -=-     =***-    =*+:         :.      ..      .-==:            =++-       .#@@%*:             
       #@@@%-   %@@@@#-::@@@@+       %@@*.   #@@@*: .*@@@@@#-         .@@@@+  .:-=+@@@@@%-:           
       =@@@@@#+.=@@@@@@@@@@@@@.      +@@@*  .#@@@@@=%@@+*@@@@+         %@@@@%@@@@@@@@@@@@@@@#:        
        .#@@@@@@@@@@@@@@@@@@@@.       .@@@=   @@@@@@@%:  %@@@@=   :##%@@@@@@@@@@@@@@@@@@@@@@@@.       
        =@@@@@@@@@@@@@#+*%@@@@.        @@@@: .@@@@@@@-  .@@@@@@   .#@@@@@@@@@@@@%##@@@@@@%@@@*        
       =@@@@@@%=+@@@@@%*=*@@@@#-      .@@@@+ :@@@@@@*   -@@@@@@.    :=+%@@@@-%@@@##@@@@@-  ..         
      *@@@@@@@--*@@@@@@@@@@@@@@@*.    :@@@@+ :@@@@@@:   -@@@@@@.       -@@@@@@@@@@@@@@%-              
      .*@@@@@@@@@@@@@@@@@@@@@@@@@%:   =@@@@= -@@@@@@    =@@@@@@.       .+@@@@@@@@@@@@@@@%*-.          
         -@@@@@@@@@@@#+++%@@@@*@@@%   +@@@@- -@@@@@@    =@@@@@@      :+@@@@@@@%=+#@@@@@@@@@@#-        
        -%@@@@@*+@@@@@**=*@@@@-@@@@:  +@@@@- -@@@@@@    =@@@@@@   .-#@@@@@@@@@@%#- :=#@@@@@@@@-       
      =%@@@@@@%:-%@@@@@@@@@@@@:@@@@:  +@@@@= -@@@@@@.   =@@@@@@.  %@@@@@@@#=#@@@@@*===+#@@@@@@=       
      #@@@@@@@%@@@@@@@@@@@@@@@ %@@@.  +@@@@= .%@@@@@    =@@@@@@.  -#@@@%+--+#@@@@@@@@@@@@@@@#-        
       @%%@@@@+%@@@@@@#--#@@@@ :##=   *@@@@+  :*%@%=    -@@@@@@:   .:#@@%@@@@@@@@@@@@@@@@@@@@.        
       %+.@@@@--*@@@@@#=#@@@@@.      :@@@@@=            :@@@@@@:   %@@@@@@@@@@@@@@@*#@@@@@@@#.        
       =@+@@@@%*#@@@@@@@@@@@@@.     :%@@@@@%%%#########%@@@@@@@-   :#@@@@%*=#@@@@@%  :%@@@@#.         
       .%@@@@@@%@@@@@@@@%%@@@@.     =@@@@@* .-+*%@@@@@@@@@@@@@@:   .%@@@@*==#@@@@@%   .%@@@@#         
        :%@@@@%@@@@@@@%= *@@@@      .*%@@+       .-=*#@@@@@@@@*    :@@@@*%@@@@@@@@%    -@@@@#         
         .=###.:=+++=:   .+**:         .               .::--:.      .=+:  .:=*#%%#:     .=+-          
                                                                                                      
      `;

      const artLines = art.split('\n');
      const artLength = artLines[1].length; // アスキーアートの幅を取得
      let position = process.stdout.columns - artLength; // 初期位置を右端に設定

      const interval = setInterval(() => {
        console.clear();
        artLines.forEach(line => {
          console.log(chalk.green(' '.repeat(Math.max(0, position)) + line)); // 色をつける
        });
        position--;

        if (position + artLength < 0) {
          clearInterval(interval);
        }
      }, 50);
  });

  program
  .command('show')
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

  program
    .command('params <value>')
    .description('Handle params')
    .action((value) => {
      console.log('Received param:', value);
  });

program.parse(process.argv);