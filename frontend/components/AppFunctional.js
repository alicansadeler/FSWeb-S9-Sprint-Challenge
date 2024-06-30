import axios from "axios";
import React, { useEffect, useState } from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = [2, 2];

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setIndex(initialIndex);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setValid(false);
    setError("");
  }

  function ilerle(e) {
    let yon = e.target.id;
    let hata = false;
    switch (yon) {
      case "left":
        if (1 < index[0]) {
          setIndex([index[0] - 1, index[1]]);
          setSteps(steps + 1);
          hata = true;
        } else {
          hata = false;
          setMessage("Sola gidemezsiniz");
        }

        break;
      case "up":
        if (1 < index[1]) {
          setIndex([index[0], index[1] - 1]);
          setSteps(steps + 1);
          hata = true;
        } else {
          hata = false;
          setMessage("Yukarıya gidemezsiniz");
        }

        break;
      case "right":
        if (index[0] < 3) {
          setIndex([index[0] + 1, index[1]]);
          setSteps(steps + 1);
          hata = true;
        } else {
          hata = false;
          setMessage("Sağa gidemezsiniz");
        }

        break;
      case "down":
        if (index[1] < 3) {
          setIndex([index[0], index[1] + 1]);
          setSteps(steps + 1);
          hata = true;
        } else {
          hata = false;
          setMessage("Aşağıya gidemezsiniz");
        }

        break;
      default:
        break;
    }

    if (hata == true) {
      setMessage(initialMessage);
    }
  }

  const validateEmail = (mail) => {
    return String(mail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function onChange(e) {
    const value = e.target.value;
    setEmail(value);

    if (validateEmail(value)) {
      setError("");
      setValid(true);
    } else {
      setError("Ouch: email must be a valid email");
      setValid(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!valid) return;

    axios
      .post("http://localhost:9000/api/result", {
        x: index[0],
        y: index[1],
        steps: steps,
        email: email,
      })
      .then(function (response) {
        console.log(response);
        reset();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Koordinatlar ({index[0]}, {index[1]})
        </h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[1, 2, 3].map((row) =>
          [1, 2, 3].map((col) => (
            <div
              key={`${row}-${col}`}
              className={`square${
                row === index[1] && col === index[0] ? " active" : ""
              }`}
            >
              {row === index[1] && col === index[0] ? "B" : null}
            </div>
          ))
        )}
      </div>
      <div className="info">
        {message && (
          <h3 style={{ color: "red" }} id="message">
            {message}
          </h3>
        )}
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>
          SOL
        </button>
        <button id="up" onClick={ilerle}>
          YUKARI
        </button>
        <button id="right" onClick={ilerle}>
          SAĞ
        </button>
        <button id="down" onClick={ilerle}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={(e) => onChange(e)}
        ></input>
        <input id="submit" type="submit" disabled={!valid}></input>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
