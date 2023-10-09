import React from 'react';
import './default_page.css';
import {Link} from 'react-router-dom';
import {RoutesConstants} from '../../constants/RoutesConstants';
import { AxiosUtils } from '../../utils/AxiosUtils';

interface State {
    data: any;
    showAddressInput: boolean;
    address: string;
    transactionsData: any;
    balanceData: any;
    showTransactions: boolean;
  }
  

class DefaultPage extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
          data: null,
          showAddressInput: false,
          address: '',
          transactionsData: null,
          balanceData: null,
          showTransactions: true
        };
      }
    
    
      showAddressInput = () => {
        this.setState({ showAddressInput: true });
      }
    
      handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ address: event.target.value });
      }
    
      renderDataTransactions() {
        const { transactionsData, balanceData } = this.state;
      
        if (transactionsData && transactionsData.data && transactionsData.data[0].ret) {
          return (
            <div className="transactions-section">
              {transactionsData.data.map((transaction: any, index: number) => (
                <div key={index} className="transaction">
                  <h3>Transacción {index + 1}</h3>
                  <div>
                    {transaction.ret && (
                      <>
                        <p>Contrato Retorno: {transaction.ret[0].contractRet}</p>
                        <p>Fee: {transaction.ret[0].fee}</p>
                        {/* Agrega más detalles de raw_data u otros campos aquí */}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }

      }
      
      renderDataBalance() {
        const { transactionsData, balanceData } = this.state;

        if (balanceData && balanceData && balanceData.data[0].balance ) {
          return (
            <div className="balance-section">
              <div className="account">
                {balanceData.data.map((account: any, index: number) => (
                  <div className="balance" key={index}>
                    <h3>Balance: {account.balance}</h3>
                    <div>{/* Puedes agregar más contenido aquí si es necesario */}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      }
      
      fetchTransactions = async () => {
        const { address } = this.state;
    
        try {
          // Realiza una solicitud a la API con la dirección ingresada
          const response = await AxiosUtils.get(`https://api.shasta.trongrid.io/v1/accounts/${address}/transactions`);
          if (response){

            this.setState({ transactionsData: response, showTransactions: true });

            // Puedes manejar la data como desees, por ejemplo, imprimiéndola en la consola
            console.log('Transacciones obtenidas:', response);

          }

          
        } catch (error) {
          console.error('Error al obtener transacciones:', error);
        }
      }

      fetchBalance = async () => {
        const { address } = this.state;
    
        try {
          // Realiza una solicitud a la API con la dirección ingresada
          const response = await AxiosUtils.get(`https://api.shasta.trongrid.io/v1/accounts/${address}`);
          if (response){
          
            this.setState({ balanceData: response, showTransactions: false });

            // Puedes manejar la data como desees, por ejemplo, imprimiéndola en la consola
            console.log('Informacion de la cuenta:', response);

          }

          
        } catch (error) {
          console.error('Error al obtener transacciones:', error);
        }
      }
    
      render() {
        const { transactionsData, balanceData } = this.state;
        const { showAddressInput, address, showTransactions } = this.state;
        return (
          <div id="test_page_container">
            <div>
              <div>
                <input
                  className="address-input"
                  type="text"
                  placeholder="Ingrese una dirección"
                  value={address}
                  onChange={this.handleAddressChange}
                />
      
                <button className="search-button" onClick={() => {
                  this.fetchTransactions();
                }}>
                  Buscar Transacciones
                </button>
      
                <button className="balance-button" onClick={() => {
                  this.fetchBalance();
                }}>
                  Ver balance
                </button>
              </div>
              {showTransactions ? this.renderDataTransactions() : this.renderDataBalance()}
            </div>
          </div>
        );
      }
      
}

export default DefaultPage;