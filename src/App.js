import React, { Component, useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import countryCodeList from "./countryCode";

import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState({}); //get currencies data for api
  const [countryCode, setCountryCode] = useState("+61");
  const [customerRate, setCustomerRate] = useState(0);
  const [customerAmount, setCustomerAmount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fromCurrency, setFromCurrency] = useState("Australian Dollar(AUD)");
  const [toCurrency, setToCurrency] = useState("United States Dollar(USD)");
  const [amount, setAmount] = useState(0);
  const [displayQuote, setDisplayQuote] = useState(false);
  const [displayError, setDisplayError] = useState("");

  useEffect(() => {
    const fetchData = async() => {
      const getCurrenciesCode = await fetch(
        `https://openexchangerates.org/api/currencies.json`
      );
      const currenciesCode = await getCurrenciesCode.json();
      setCurrencies(currenciesCode);
    }
    fetchData();
  }, []);

  async function getQuote(e) {
    e.preventDefault();
    const fromCurrencyCode = getCurrencyAbbr(fromCurrency); //get currency code e.g: AUD
    const toCurrencyCode = getCurrencyAbbr(toCurrency);
    const response = await fetch(
      `https://api.ofx.com/PublicSite.ApiService/OFX/spotrate/Individual/${fromCurrencyCode}/${toCurrencyCode}/${amount}?format=json`
    );
    const data = await response.json();
    setCustomerRate(data.CustomerRate);
    setCustomerAmount(data.CustomerAmount);
    console.log(data);
    if (data.ErrorCode) {
      setDisplayError(data.Message); //when the currency is not supported, throw the error message
    } else {
      setDisplayQuote(true);
    }
  }

  /* getCurrencyAbbr() 
    this function get the currency code from currency string 
    for api request and quote display
  */
  function getCurrencyAbbr(currency) {
    return currency.slice(
      currency.lastIndexOf("(") + 1,
      currency.lastIndexOf(")")
    );
  }

  function resetForm() {
    setCustomerRate(0);
    setCustomerAmount(0);
    setFirstName("");
    setLastName("");
    setEmailAddress("");
    setPhoneNumber("");
    setAmount(0);
    setDisplayQuote(false);
    setDisplayError("");
  }

  return (
    <div className="App">
      {!displayQuote ? (
        <>
          <h1>Quick Quote</h1>
          <hr />
          <Form onSubmit={(e) => getQuote(e)}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>
                  First name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  required
                  type="text"
                  placeholder="First name"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>
                  Last name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  required
                  type="text"
                  placeholder="Last name"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={emailAddress}
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group controlId="formGridAddress2">
              <Form.Label>Telephone/Mobile</Form.Label>
              <InputGroup className="mb-3">
                <DropdownButton
                  as={InputGroup.Prepend}
                  variant="outline-secondary"
                  id="input-group-dropdown-1"
                  title={countryCode}
                  onSelect={(e) => {
                    setCountryCode(e);
                  }}
                >
                  {countryCodeList.map((e) => (
                    <Dropdown.Item
                      key={e.name}
                      eventKey={e.dial_code}
                    >{`${e.dial_code} ${e.name}`}</Dropdown.Item>
                  ))}
                </DropdownButton>
                <FormControl
                  aria-describedby="basic-addon1"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>
                  From Currency<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Dropdown
                  onSelect={(e) => {
                    setFromCurrency(e);
                  }}
                >
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    {fromCurrency}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {Object.entries(currencies).map((currency) => (
                      <Dropdown.Item
                        key={currency[0]}
                        eventKey={`${currency[1]}(${currency[0]})`}
                      >{`${currency[1]}(${currency[0]})`}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  To Currency<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Dropdown
                  onSelect={(e) => {
                    setToCurrency(e);
                  }}
                >
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    {toCurrency}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {Object.entries(currencies).map((currency) => (
                      <Dropdown.Item
                        key={currency[0]}
                        eventKey={`${currency[1]}(${currency[0]})`}
                      >{`${currency[1]}(${currency[0]})`}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>
                  Amount <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            {displayError && <p>{displayError}</p>}

            <Button variant="primary" type="submit" className="rounded-pill">
              Get Quote
            </Button>
          </Form>
        </>
      ) : (
        <div className="quote">
          <h1>Quick Quote</h1>
          <hr />
          <div className="quote-details">
            <div className="container">
              <h3>OFX Customer Rate</h3>
              <h1>{customerRate}</h1>
              <h3>From</h3>
              <h2>
                {getCurrencyAbbr(fromCurrency)}
                {amount}
              </h2>
              <h3>To</h3>
              <h2>
                {getCurrencyAbbr(toCurrency)}
                {customerAmount}
              </h2>
            </div>
            <Button
              variant="primary"
              type="submit"
              className="rounded-pill"
              onClick={resetForm}
            >
              Get Quote
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
