import { useState, useEffect } from 'react';
import SvgIcon from '../components/SvgIcon';
import {
  RCtoMNT,
  CRBNtoMNT,
  getAmountOfTokens,
  balanceOfRC,
  balanceOfCRBN,
  MNTtoRC,
  MNTtoCRBN
} from '../utils/web3/swap';
const tokensRC = {
  RECARBON: {
    symbol: 'RC',
    name: 'ReCarbon',
  },
  MNT: {
    symbol: 'MNT',
    name: 'Mantle',
  }
};
const tokensCRBN = {
  CARBON: {
    symbol: 'CRBN',
    name: 'Carbon',
  },
  MNT: {
    symbol: 'MNT',
    name: 'Mantle',
  }
};
const Swap = data => {
  const fromTokenRC = tokensRC.RECARBON;
  const fromTokenCRBN = tokensCRBN.CARBON;
  const toToken = tokensRC.MNT;
  const [direction, setDirection] = useState(0);
  const [swapRC, setSwapRC] = useState([fromTokenRC, toToken]);
  const [swapCRBN, setSwapCRBN] = useState([fromTokenCRBN, toToken]);
  const [amountRC, setAmountRC] = useState(0);
  const [amountCRBN, setAmountCRBN] = useState(0);
  const [amountOfTokensRC, setmountOfTokensRC] = useState(0);
  const [amountOfTokensCRBN, setmountOfTokensCRBN] = useState(0);
  const [balanceTextRC, setbBalanceTextRC] = useState("RC");
  const [balanceTextCRBN, setbBalanceTextCRBN] = useState("CRBN");

  useEffect(() => {
   try { 
    getbalanceOfRC();
    getbalanceOfCRBN();
   } catch (error) {
    
   }
    if (direction === 1) {
      setSwapRC([toToken, fromTokenRC]);
      setSwapCRBN([toToken, fromTokenCRBN]);
    } else {
      setSwapRC([fromTokenRC, toToken]);
      setSwapCRBN([fromTokenCRBN, toToken]);
    }

    getAmountOfTokenRC(amountRC);
    getAmountOfTokenCRBN(amountCRBN);
  }, [direction, toToken, fromTokenRC, fromTokenCRBN, amountRC, amountCRBN]);

  async function getbalanceOfRC(){
    let tempBalance = await balanceOfRC();
    setbBalanceTextRC("Your ReCarbon Balance is:"+ tempBalance);
  }

  async function getbalanceOfCRBN(){
    let tempBalance = await balanceOfCRBN();
    setbBalanceTextCRBN("Your Carbon Balance is:"+ tempBalance);
  }

  async function getAmountOfTokenRC() {
    if (amountRC !== 0) {
      let temptoken = await getAmountOfTokens(amountRC);
      setmountOfTokensRC(temptoken);
    }
  }

  async function getAmountOfTokenCRBN() {
    if (amountCRBN !== 0) {
      let temptoken = await getAmountOfTokens(amountCRBN);
      setmountOfTokensCRBN(temptoken);
    }
  }

  async function swapCallRC() {
    try {
      if (swapRC[0].symbol === 'RC') {
        await RCtoMNT(amountRC.toString());
      } else {
        await MNTtoRC(amountRC.toString());
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async function swapCallCRBN() {
    try {
      if (swapCRBN[0].symbol === 'CRBN') {
        await CRBNtoMNT(amountCRBN.toString());
      } else {
        await MNTtoCRBN(amountCRBN.toString());
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  return (
    <form className="p-5">
      <span className='pb-3 block text-sm font-semibold'>{data.sdf.is_rc ? balanceTextRC : balanceTextCRBN}</span>
      <div className="relative mb-5">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <SvgIcon icon={swapRC[0].symbol} className="w-5 h-5" />
        </div>
        {data.sdf.is_rc ? 
        <input
          type="text"
          onChange={(event) => {
            setAmountRC(event.target.value);
          }}
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0.0"
          required
        /> : 
        <input
          type="text"
          onChange={(event) => {
            setAmountCRBN(event.target.value);
          }}
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0.0"
          required
        />}
        <button
          type="button"
          className="text-white absolute right-2.5 bottom-2.5 font-medium rounded-lg text-sm px-4 py-2"
        >
          max
        </button>
      </div>
      <div className="flex justify-center mb-5">
        <button
          type="button"
          className="bg-gray-100 p-3 rounded-full text-gray-500 text-sm font-medium"
          onClick={async () => {
            setDirection((direction + 1) % 2);
          }}
        >
          <SvgIcon icon="swap" className="w-8 h-8 text-gray-400" />
        </button>
      </div>
      <div className="relative mb-5">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <SvgIcon icon={swapRC[1].symbol} className="w-5 h-5" />
        </div>
        {data.sdf.is_rc ?
        <input
          type="text"
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={amountOfTokensRC}
          required
        /> : <input
        type="text"
        className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={amountOfTokensCRBN}
        required
      />}
      </div>
      <div className="flex justify-center">
        {data.sdf.is_rc ?
        <button
          type="button"
          className="px-4 py-3 text-white bg-gray-700 rounded-lg border border-gray-600"
          onClick={swapCallRC}
        >
          Swap
        </button> : 
        <button
        type="button"
        className="px-4 py-3 text-white bg-gray-700 rounded-lg border border-gray-600"
        onClick={swapCallCRBN}
      >
        Swap
      </button>}
      </div>
    </form>
  );
};

export default Swap;
