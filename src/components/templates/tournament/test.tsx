// 100mの風換算
export const CalcWind100m = (record: number, wind: number) => {
  const Alt = 10; // 海抜10m（東京）
  const dens = Math.exp(-0.000125 * Alt);
  const t0 =
    (1.028 - 0.028 * dens * Math.pow(1.0 - (wind * record) / 100, 2)) * record;
  return Math.floor(t0 * 100) / 100;
};

// 200mの風換算
export const CalcWind200m = (record: number, wind: number, lane: number) => {
  const Alt = 0; // 海抜10m（東京）だけど0で計算
  let dt = 0;
  if (record < 21.5) {
    if (lane === 1) {
      dt =
        0.6823850739e-2 * Math.pow(wind, 2) -
        0.6261746031e-1 * wind +
        0.676973961e-3 +
        (-0.8533086093e-6 * Math.pow(wind, 2) +
          0.7409523797e-5 * wind -
          0.9576524416e-4) *
          Alt;
    }
    if (lane === 2) {
      dt =
        0.6037981841e-2 * Math.pow(wind, 2) -
        0.6160238093e-1 * wind -
        0.5337868373e-2 +
        (-0.7012368506e-6 * Math.pow(wind, 2) +
          0.6901904772e-5 * wind -
          0.94842548e-4) *
          Alt;
    }
    if (lane === 3) {
      dt =
        0.593795092e-2 * Math.pow(wind, 2) -
        0.6508253968e-1 * wind -
        0.4702741522e-2 +
        (-0.7021645076e-6 * Math.pow(wind, 2) +
          0.7283809515e-5 * wind -
          0.9485541123e-4) *
          Alt;
    }
    if (lane === 4) {
      dt =
        0.5849876305e-2 * Math.pow(wind, 2) -
        0.6855952381e-1 * wind -
        0.5205524601e-2 +
        (-0.6920222619e-6 * Math.pow(wind, 2) +
          0.7647619043e-5 * wind -
          0.9491032781e-4) *
          Alt;
    }
    if (lane === 5) {
      dt =
        0.5727788093e-2 * Math.pow(wind, 2) -
        0.7192698412e-1 * wind -
        0.4418058132e-2 +
        (-0.6745825703e-6 * Math.pow(wind, 2) +
          0.8003809515e-5 * wind -
          0.9506468759e-4) *
          Alt;
    }
    if (lane === 6) {
      dt =
        0.5635281356e-2 * Math.pow(wind, 2) -
        0.7525793651e-1 * wind -
        0.4965367685e-2 +
        (-0.6675324621e-6 * Math.pow(wind, 2) +
          0.83752381e-5 * wind -
          0.9518787886e-4) *
          Alt;
    }
    if (lane === 7) {
      dt =
        0.5562976702e-2 * Math.pow(wind, 2) -
        0.7846031747e-1 * wind -
        0.4763760038e-2 +
        Alt *
          (-0.6695732846e-6 * Math.pow(wind, 2) +
            0.8730476192e-5 * wind -
            0.9523141616e-4);
    }
    if (lane === 8) {
      dt =
        0.5497165554e-2 * Math.pow(wind, 2) -
        0.8159285713e-1 * wind -
        0.5002267739e-2 +
        (-0.6547309794e-6 * Math.pow(wind, 2) +
          0.9080952375e-5 * wind -
          0.9529226969e-4) *
          Alt;
    }
  } else {
    if (lane === 1) {
      dt =
        0.8164192923e-2 * Math.pow(wind, 2) -
        0.7134126985e-1 * wind -
        0.5253349577e-2 +
        (-0.9581941721e-6 * Math.pow(wind, 2) +
          0.7988571428e-5 * wind -
          0.1015294992e-3) *
          Alt;
    }
    if (lane === 2) {
      dt =
        0.8012420137e-2 * Math.pow(wind, 2) -
        0.7549761905e-1 * wind -
        0.5664811539e-2 +
        Alt *
          (-0.9247990043e-6 * Math.pow(wind, 2) +
            0.8438095233e-5 * wind -
            0.1016949907e-3);
    }
    if (lane === 3) {
      dt =
        0.7904916485e-2 * Math.pow(wind, 2) -
        0.7968492063e-1 * wind -
        0.5239125688e-2 +
        (-0.9269635173e-6 * Math.pow(wind, 2) +
          0.8905714292e-5 * wind -
          0.1016551638e-3) *
          Alt;
    }
    if (lane === 4) {
      dt =
        0.8307720076e-2 * Math.pow(wind, 2) -
        0.8214841271e-1 * wind -
        0.5935065061e-2 +
        (-0.120432901e-5 * Math.pow(wind, 2) +
          0.844761905e-5 * wind -
          0.1016346319e-3) *
          Alt;
    }
    if (lane === 5) {
      dt =
        0.7666048256e-2 * Math.pow(wind, 2) -
        0.8769523808e-1 * wind -
        0.523397251e-2 +
        (-0.9012368561e-6 * Math.pow(wind, 2) +
          0.9736190467e-5 * wind -
          0.101890167e-3) *
          Alt;
    }
    if (lane === 6) {
      dt =
        0.7537878777e-2 * Math.pow(wind, 2) -
        0.9157222225e-1 * wind -
        0.4871572736e-2 +
        (-0.8844155844e-6 * Math.pow(wind, 2) +
          0.1013999999e-4 * wind -
          0.1020086579e-3) *
          Alt;
    }
    if (lane === 7) {
      dt =
        0.743826016e-2 * Math.pow(wind, 2) -
        0.9541269842e-1 * wind -
        0.491115239e-2 +
        (-0.8664811526e-6 * Math.pow(wind, 2) +
          0.1057238095e-4 * wind -
          0.1021726653e-3) *
          Alt;
    }
    if (lane === 8) {
      dt =
        0.7340342199e-2 * Math.pow(wind, 2) -
        0.9905396825e-1 * wind -
        0.5168418916e-2 +
        (-0.8719851461e-6 * Math.pow(wind, 2) +
          0.1096761904e-4 * wind -
          0.1021486705e-3) *
          Alt;
    }
  }
  if (wind === 0 && Alt === 0) {
    dt = 0;
  }
  const t0 = record - dt;
  return Math.round(t0 * 100) / 100;
};
