"use client";

import './styles.css';
import { useState, useMemo } from "react";
import { Activity, Loading } from "../icons";
import { DepositContent } from "./DepositContent";
import { ActivityContent } from "./ActivityContent";
import { useTransaction } from "../TransactionPool";
import ExtendedDetails from '../ExtendedDetails';
import classNames from 'classnames';
import { useWallets } from '@/app/hooks/useWallets';

export enum Tabs {
  Deposit,
  Withdraw,
  Activity
}

export interface DepositProps {
  amountEther: number | string | undefined;
  setAmountEther: React.Dispatch<React.SetStateAction<number | undefined | string>>;
}

const Deposit: React.FC<DepositProps> = ({ amountEther, setAmountEther }) => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Deposit);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { pendingTransactions } = useTransaction();
  const { evmWallet } = useWallets();

  // Memoizing whether there are pending transactions to avoid recalculations
  const hasPendingTransactions = useMemo(() => pendingTransactions.length > 0, [pendingTransactions]);

  // Helper function to switch tabs with memoization
  const handleTabClick = useMemo(() => (tab: Tabs) => {
    if (tab !== Tabs.Withdraw) setActiveTab(tab); // Withdraw is disabled
  }, []);

  return (
    <div className="deposit-container flex flex-col">
      <div className={classNames("deposit-card", { 'no-padding': isModalOpen })}>
        <div className={classNames("header-tabs", { 'activity-margin': activeTab === Tabs.Activity })}>
          <div
            className={classNames("header-tab", { active: activeTab === Tabs.Deposit })}
            onClick={() => handleTabClick(Tabs.Deposit)}
          >
            Deposit
          </div>
          
          <div className={classNames("header-tab", "disabled", { active: activeTab === Tabs.Withdraw })}>
            Withdraw
          </div>
          
          {evmWallet && (
            <div
              className={classNames("header-tab", "flex", "items-center", "justify-center", { active: activeTab === Tabs.Activity })}
              onClick={() => handleTabClick(Tabs.Activity)}
            >
              {hasPendingTransactions ? <Loading /> : <Activity />}
            </div>
          )}
        </div>

        {activeTab === Tabs.Deposit && (
          <DepositContent
            modalStuff={[isModalOpen, setIsModalOpen]}
            amountEther={amountEther}
            setAmountEther={setAmountEther}
          />
        )}

        {activeTab === Tabs.Activity && (
          <ActivityContent setActiveTab={setActiveTab} />
        )}
      </div>

      {!isModalOpen && activeTab === Tabs.Deposit && <ExtendedDetails amountEther={amountEther} />}
    </div>
  );
};

export default Deposit;
