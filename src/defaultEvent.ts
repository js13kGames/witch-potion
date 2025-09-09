import { GameEventState } from './eventRunner';

export const defaultEventState: GameEventState = {
  /*@preserve*/
  event: {
    /*@preserve*/
    icon: '',
    /*@preserve*/
    title: '',
    /*@preserve*/
    children: [
      {
        /*@preserve*/
        id: 'harvest',
        /*@preserve*/
        type: 'garden',
        /*@preserve*/
        p: 'You may now harvest your garden.',
      },
      {
        /*@preserve*/
        re: true,
        /*@preserve*/
        id: 'day',
        /*@preserve*/
        type: 'ch',
        /*@preserve*/
        p: 'You are at your shop. What would you like to do today?',
        /*@preserve*/
        choices: [
          {
            /*@preserve*/
            text: 'Visit the reagent merchant.',
            /*@preserve*/
            n: 'merch',
          },
          {
            /*@preserve*/
            text: 'Mix potions.',
            /*@preserve*/
            n: 'pot',
          },
          {
            /*@preserve*/
            text: 'View inventory.',
            /*@preserve*/
            n: 'inv',
          },
          {
            /*@preserve*/
            text: 'End the day.',
            /*@preserve*/
            n: 'nextDay',
          },
        ],
      },
      {
        /*@preserve*/
        id: 'nextDay',
        /*@preserve*/
        type: 'end',
      },
      // {
      //   /*@preserve*/
      //   id: 'merch',
      //   /*@preserve*/
      //   type: 'choice',
      //   /*@preserve*/
      //   p: '"Buying or selling?" the merchant asks.',
      //   /*@preserve*/
      //   choices: [
      //     {
      //       /*@preserve*/
      //       text: 'Buying.',
      //       /*@preserve*/
      //       n: 'merchBuying',
      //     },
      //     {
      //       /*@preserve*/
      //       text: 'Selling.',
      //       /*@preserve*/
      //       n: 'merchSelling',
      //     },
      //     {
      //       /*@preserve*/
      //       text: 'Go back.',
      //       /*@preserve*/
      //       n: 'day',
      //     },
      //   ],
      // },
    ],
  },
  /*@preserve*/
  evalVars: {},
  /*@preserve*/
  currentChildId: 'default',
};
