import './BasePage.css';
import { useContext } from 'react';
import { Context } from '../../main';
import { Sider } from './Sider';
import { Header } from './Header'

export function BasePage() {

  const {store} =useContext(Context);

  return (
    <div className="outer-wrapper">
      <Sider />
      <div className="header-wrapper">
        <Header />
        <div></div>
      </div>
    </div>
  );
}