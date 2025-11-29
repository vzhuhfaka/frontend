import './HomePage.css';
import { useContext } from 'react';
import { Context } from '../../main';
import { BasePage } from '../../components/mainPage_components/BasePage';

export function HomePage() {

  const {store} =useContext(Context);

  return (
    <BasePage />
  );
}