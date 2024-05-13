import * as React from 'react';

export default function Market() {
  return(
    <>
      <h1>
        Market
      </h1>
      {/* <p>
        We run a real-time brokerage that sells stocks. Build a UI that can accept a real-time feed of orders and displays the status of orders visually.
        <br />
        A Market is composed of buy orders and sell orders that are submitted to the broker.
        <div>
          <div style={{ border: '1px solid black', margin: '10px', padding: '10px', display: 'inline-block'}}>
            price: number
            <br />
            quantity: Integer
            <br />
            symbol: string
            <br />
            type: SELL / BUY
            <br />
            status: OPEN, CANCELLED, FULFILLED
          </div>
        </div>

        When a buy order has a price below a sell order, the quantity of each diminishes until one of the quantities goes to 0, and thus the order is fulfilled.
        <br />
        <ol>
          <li>The UI should allow generating orders of any kind and process the input</li>
          <li>The UI can be very simple but must show the best big and best offer (the price to buy and the price to sell) correctly at any point</li>
        </ol>
      </p> */}
      <MarketOrders />
    </>
  )
}

function useGetId() {
  const [index, setIndex] = React.useState(0);

  return (prefix) => {
    const nextId = `${prefix}-${index}`;
    setIndex(i => i + 1);
    return nextId
  } 
}

// Start: 17.22
// End: 19.20 too slow?
// How to improve?
//   - Use style attribute instead of css
//   - Review basic form apis, specially for elements that are not that common (FormData, select, checkbox, radio, date, file, password, range, time, week)
//   - Review splice and toSpliced api
function MarketOrders() {
  /*
    type Order= {
      id: string;
      price: number;
      quantity: number;
      symbol: string;
    }

    type FulfilledOrder = {
      id: string;
      buyOrder: Order;
      sellOrder: Order;
      price: number;
      quantity: number
    }
  */
  const [buyOrders, setBuyOrders] = React.useState({}); // Record<string, Array<Order>>
  const [sellOrders, setSellOrders] = React.useState({}); // Record<string, Array<Order>>
  const [fulfilledOrders, setFulfilledOrders] = React.useState([]) // Array<FulfilledOrder>
  const getId = useGetId();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target)
    const price = formData.get('price');
    const quantity = formData.get('quantity');
    const symbol = formData.get('symbol');
    const type = formData.get('type');

    console.log({ price, quantity, symbol, type });

    const order = {
      id: getId(type),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      symbol,
    }

    if (type === 'Sell') {
      let buyOrderIndex = buyOrders[symbol]?.findIndex(b => b.symbol === order.symbol && b.price >= order.price);
      const buyOrdersCopy = [...(buyOrders[symbol] ?? [])]
      const newFilledOrders = []
 
      while(buyOrderIndex > -1) {
        const buyOrder = buyOrders[symbol][buyOrderIndex];
        const quantitySold = Math.min(buyOrder.quantity, order.quantity);
        order.quantity = order.quantity - quantitySold;

        buyOrdersCopy.splice(buyOrderIndex, 1, buyOrder.quantity - quantitySold > 0 ? {
          ...buyOrder,
          quantity: buyOrder.quantity - quantitySold,
        } : undefined)
        
        newFilledOrders.push({
          id: getId(`fulfilled-order-${buyOrder.id}-${order.id}`),
          buyOrder,
          sellOrder: order,
          price: buyOrder.price,
          quantity: quantitySold,
        })

        buyOrderIndex = buyOrderIndex + 1;
        if (!(
          buyOrderIndex < buyOrders[symbol].length &&
          buyOrders[symbol][buyOrderIndex].price >= order.price &&
          order.quantity > 0

        )) {
          buyOrderIndex = -1
          setBuyOrders(o => ({
            ...o,
            [order.symbol]: buyOrdersCopy.filter(Boolean),
          }))
          setFulfilledOrders(o => [...o, ...newFilledOrders])
        }
      }

      if (order.quantity > 0) {
        setSellOrders(o => ({
          ...o,
          [symbol]: [...(o[symbol] ?? []), order].sort((a, b) => a.price - b.price),
        }))
      }
    } else {
      let sellOrderIndex = sellOrders[symbol]?.findIndex(s => s.symbol === order.symbol && s.price <= order.price);
      const sellOrdersCopy = [...(sellOrders[symbol] ?? [])];
      const newFulfilledOrders = [];

      while (sellOrderIndex > -1) {
        const sellOrder = sellOrders[symbol][sellOrderIndex];
        const quantitySold = Math.min(sellOrder.quantity, order.quantity);
        order.quantity = order.quantity - quantitySold;

        sellOrdersCopy.splice(sellOrderIndex, 1, sellOrder.quantity - quantitySold > 0 ? {
          ...sellOrder,
          quantity: sellOrder.quantity - quantitySold,
        } : undefined)

        newFulfilledOrders.push({
          id: getId(`fulfilled-order-${order.id}-${sellOrder.id}`),
          buyOrder: order,
          sellOrder: sellOrder,
          price: order.price,
          quantity: quantitySold,
        })

        sellOrderIndex = sellOrderIndex + 1;
        if (!(
          sellOrderIndex < sellOrders[symbol].length &&
          sellOrders[symbol][sellOrderIndex].price <= order.price && 
          order.quantity > 0
        )) { 
          sellOrderIndex = -1;

          setSellOrders(o => ({
            ...o,
            [order.symbol]: sellOrdersCopy.filter(Boolean)
          }));
          setFulfilledOrders(o => [...o, ...newFulfilledOrders]);
        }
      }

      if (order.quantity > 0) {
        setBuyOrders(o => ({
          ...o,
          [symbol]: [...(o[symbol] ?? []), order].sort((a, b) => a.price - b.price),
        }))
      }
    }

    // todo: clear form
  }

  console.log({ sellOrders, buyOrders, fulfilledOrders })

  return (
    <div className='market'>
      <div className='market-header'>
        <form className='order-form' onSubmit={handleSubmit}>
          <h2>Submit order</h2>
          
          <label>
            Price:
            <input name="price" type='number' required />
          </label>
          
          <label>
            Quantity:
            <input name="quantity" type='number' required  />
          </label>

          <label>
            Symbol:
            <input name="symbol" required  />
          </label>

          <label>
            Type:
            <select name="type" required>
              <option>Sell</option>
              <option>Buy</option>
            </select>
          </label>

          <button type="submit">Create</button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Best offers</h2>
          {Object.keys(sellOrders).map(symbol => (
            sellOrders[symbol].length > 0 && (
              <div key={symbol}>
                Symbol: {symbol} | Qty: {sellOrders[symbol][0].quantity} | Price: {sellOrders[symbol][0].price}
              </div>
            )
          ))}
        </div>
      </div>

      <div className='order-dashboard'>
        <div className='buy-orders'>
          <h2>Buy Orders</h2>
          <div className='order-list'>
            {Object.keys(buyOrders).map(ticker => (
              buyOrders[ticker].map(order => (
                <div key={order.id} className='order'>
                  <em>{order.symbol}</em>
                  <em>Qty: {order.quantity}</em>
                  <em>Price: {order.price}</em>
                </div>
              ))
            ))}
          </div>
        </div>
        <div className='sell-orders'>
          <h2>Sell Orders</h2>
          <div className='order-list'>
            {Object.keys(sellOrders).map(ticker => (
              sellOrders[ticker].map(order => (
                <div key={order.id} className='order'>
                  <em>{order.symbol}</em>
                  <em>Qty: {order.quantity}</em>
                  <em>Price: {order.price}</em>
                </div>
              ))
            ))}
          </div>
        </div>
        <div className='fulfilled-orders'>
          <h2>Fulfilled Orders</h2>
          <div className='order-list'>
            {fulfilledOrders.map(fulfilledOrders => (
              <div key={fulfilledOrders.id} className='order'>
                <em>{fulfilledOrders.buyOrder.symbol}</em>
                <em>Qty: {fulfilledOrders.quantity}</em>
                <em>Price: {fulfilledOrders.price}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
