import { Container } from '@chakra-ui/react';
import React, { useState, VFC } from 'react';

import dynamic from 'next/dynamic';
const SwipeToDelete = dynamic(
  () =>
    import('react-swipe-to-delete-component').then(
      (modules) => modules.ClientOnlyComponent
    ),
  { ssr: false }
);

const data = [
  { id: 1, text: 'End of summer reading list', date: '1.03.2016' },
  { id: 2, text: 'Somewhere in the middle 📸', date: '23.01.2017' },
  {
    id: 3,
    text: 'Good morning to 9M of you?!?! ❤️🙏🏻Feeling very grateful and giddy.',
    date: '12.01.2019',
  },
];

const list = data.map((item) => (
  <SwipeToDelete key={item.id} item={item}>
    <a className="list-group-item">
      <h4 className="list-group-item-heading">{item.date}</h4>
      <p className="list-group-item-text">{item.text}</p>
    </a>
  </SwipeToDelete>
));

const Test = () => {
  // const [test1, setTest1] = useState('hello');
  // const [test2, setTest2] = useState('');
  // const [test3, setTest3] = useState('');
  // const [toggleEdit, setToggleEdit] = useState(false);

  return (
    <Container py={8}>
      <SwipeToDelete key={item.id} item={item}>
        <a className="list-group-item">
          <h4 className="list-group-item-heading">{item.date}</h4>
          <p className="list-group-item-text">{item.text}</p>
        </a>
      </SwipeToDelete>
    </Container>
  );
};

export default Test;
