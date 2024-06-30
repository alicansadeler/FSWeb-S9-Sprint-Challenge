import axios from "axios";
import React, { useState } from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = [2, 2];

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);

  function reset() {
    setIndex(initialIndex);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
  }

  function ilerle(e) {
    let yon = e.target.id;

    switch (yon) {
      case "left":
        if (1 < index[0]) {
          setIndex([index[0] - 1, index[1]]);
          setSteps(steps + 1);
        } else {
          setMessage("Sola gidemezsiniz!");
        }

        break;
      case "up":
        if (1 < index[1]) {
          setIndex([index[0], index[1] - 1]);
          setSteps(steps + 1);
        } else {
          setMessage("Yukarı gidemezsiniz!");
        }

        break;
      case "right":
        if (index[0] < 3) {
          setIndex([index[0] + 1, index[1]]);
          setSteps(steps + 1);
        } else {
          setMessage("Sağa gidemezsiniz!");
        }

        break;
      case "down":
        if (index[1] < 3) {
          setIndex([index[0], index[1] + 1]);
          setSteps(steps + 1);
        } else {
          setMessage("Aşağı gidemezsiniz!");
        }

        break;
      default:
        break;
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const [error, setError] = useState("");

  function onChange(e) {
    const value = e.target.value;

    if (validateEmail(value)) {
      setEmail(value);
      setError("");
    } else {
      setError("Geçerli bir email adresi girin.");
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:9000/api/result", {
        x: index[0],
        y: index[1],
        steps: steps,
        email: email,
      })
      .then(function (response) {
        console.log(response);
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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === 4 ? " active" : ""}`}>
            {idx === 4 ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message"></h3>
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
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
