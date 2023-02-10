export const requestTickets = async (tickerName) => {
  //запросить определенный  тикер
  const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD`;
  const data = await fetch(apiUrl);
  return data.json().then((r) => r);
};

export const getAllTickersName = (globalData) => {
  //получения имена всех криптовалютов с сервера
  const suggest = fetch(
    'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
  );
  suggest
    .then((r) => r.json())
    .then((r) => {
      globalData.allTickersName = r.Data;
    });
};
