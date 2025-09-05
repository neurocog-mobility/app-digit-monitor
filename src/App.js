import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/styles.css';
import num1 from './audio/1.mp3'
import num2 from './audio/2.mp3'
import num3 from './audio/3.mp3'
import num4 from './audio/4.mp3'
import num5 from './audio/5.mp3'
import num6 from './audio/6.mp3'
import num7 from './audio/7.mp3'
import num8 from './audio/8.mp3'
import num9 from './audio/9.mp3'
import num10 from './audio/10.mp3'

import { useState, useEffect } from 'react';

function App() {
  const listAudioSource = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10];
  const listAudio6 = [];
  const listAudio10 = [];
  for (let i=0; i<listAudioSource.length; i++) {
    let audioFile = new Audio(listAudioSource[i]);
    if (i < 6) {
      listAudio6.push(audioFile)
    }
    listAudio10.push(audioFile)
  }

  const [listAudio, setListAudio] = useState(listAudio10);
  const [show, setShow] = useState(false);
  const [doubleDigits, setDoubleDigits] = useState(true);
  const [trackedDigits, setTrackedDigits] = useState(
    [Math.floor(Math.random() * listAudio.length/2) + 1,
    Math.floor(Math.random() * listAudio.length/2 + listAudio.length/2) + 1]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [intervalLimits, setIntervalLimits] = useState([500, 1500]);
  const [trialCount, setTrialCount] = useState(() => {
    return JSON.parse(window.localStorage.getItem('COUNT_DIGITMONITOR')) || 1
  });
  const [listTrials, setListTrials] = useState(() => {
    return JSON.parse(window.localStorage.getItem('LIST_TRIALS_DIGITMONITOR')) || []
  });

  useEffect(() => {
    window.localStorage.setItem('COUNT_DIGITMONITOR', JSON.stringify(trialCount));
  }, [trialCount]);

  useEffect(() => {
    window.localStorage.setItem('LIST_TRIALS_DIGITMONITOR', JSON.stringify(listTrials));
  }, [listTrials]);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        setRandomNumber(Math.floor(Math.random() * listAudio.length));
        if (isPlaying) {
          const randomAudio = listAudio[randomNumber];
          randomAudio.play();

          // update trial list
          let ts = Date.now() // seconds
          let unix = new Date(ts);
          let trackedOne, trackedTwo;
          if (doubleDigits) {
            trackedOne = trackedDigits[0];
            trackedTwo = trackedDigits[1];
          } else {
            trackedOne = trackedDigits[0];
            trackedTwo = -1;
          }
          let dictTrial = {
            id: listTrials.length,
            trial: trialCount,
            number: randomNumber+1,
            time_unix: String(unix),
            time: String(unix.toISOString()),
            tracked_one: trackedOne,
            tracked_two: trackedTwo,
            valid: true};
          setListTrials([dictTrial, ...listTrials])
        }
      },
      Math.random() * (intervalLimits[1] - intervalLimits[0]) + intervalLimits[0]
      ); // Random interval between 500ms and 1500ms

    return () => clearInterval(intervalId); 
  }, [isPlaying, listAudio, intervalLimits, randomNumber, listTrials, trialCount, doubleDigits, trackedDigits]); 

  useEffect(() => {
    handleGenerateDigits();
  }, [doubleDigits, listAudio])

  function handleStartStop() {
    setIsPlaying(!isPlaying);
  }

  function handlePlus() {
    setTrialCount(trialCount + 1);
  }
  function handleMinus() {
    if (trialCount > 1) {
      setTrialCount(trialCount - 1);
    };
  }
  function handleDigitChange() {
    setDoubleDigits(!doubleDigits);
  }
  function handleSpeedFast() {
    setIntervalLimits([250, 1000]);
  }
  function handleSpeedMedium() {
    setIntervalLimits([500, 1500]);
  }
  function handleSpeedSlow() {
    setIntervalLimits([1000, 2500]);
  }
  function handleAudioSix() {
    setListAudio(listAudio6);
  }
  function handleAudioTen() {
    setListAudio(listAudio10);
  }
  function handleGenerateDigits() {
    let newDigits;
    if (doubleDigits) {
      newDigits = [Math.floor(Math.random() * listAudio.length/2) + 1,
        Math.floor(Math.random() * listAudio.length/2 + listAudio.length/2) + 1];
    } else {
      newDigits = [Math.floor(Math.random() * listAudio.length) + 1];
    }
    setTrackedDigits(newDigits); 
  }
  function handleValid(id) {
    const newList = listTrials.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          valid: !item.valid,
        };
        return updatedItem;
      }
      return item;
    });
    setListTrials(newList);
  }
  function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }
  function handleExport() {
    if (listTrials.length > 0) {
        console.log([convertToCSV(listTrials)])
        var m = new Date();
        var dateString =
            m.getFullYear() + "-" +
            ("0" + (m.getMonth()+1)).slice(-2) + "-" +
            ("0" + m.getDate()).slice(-2) + "_" +
            ("0" + m.getHours()).slice(-2) + "-" +
            ("0" + m.getMinutes()).slice(-2) + "-" +
            ("0" + m.getSeconds()).slice(-2);
        var blob = new Blob([convertToCSV(listTrials)], {type: "text/plain;charset=utf-8"});
        var fileName = "digitmonitoring_" + dateString + ".csv";

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleReset = () => {
    setTrialCount(1);
    setListTrials([]);
    setShow(false);
  }

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Digit Monitoring Task</Navbar.Brand>
          <Nav>
            <Nav.Link href="https://uwaterloo.ca/neurocognition-mobility-lab">Neuro-cognition & Mobility Lab</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="https://doi.org/10.1007/s00221-024-06800-3"
          style={{fontSize: '0.75rem', fontStyle: 'italic'}}
          target="_blank">Task adapted from: Norouzian et al. (2024).</Navbar.Brand>
        </Container>
      </Navbar>

      <Row style={{marginLeft: "5vw", marginRight: "5vw"}}>
        <Col style={{alignItems: "stretch"}}>
        <Card
        style={{
          marginLeft: "auto", marginRight: "auto", marginTop: "16px",
          boxShadow: "1px 4px 4px #e1e1e1", height: "20vh", justifyContent: "center",
          alignItems: "center", padding: "4px"
        }}>
          <Card.Title style={{fontSize: "1.5rem"}}>Trial #{trialCount}</Card.Title>
          <div style={{display: 'flex', flexDirection: 'row', margin: '16px'}}>
            <Button variant="dark" size="xl" onClick={handleMinus} style={{margin: "2px"}}>-</Button>
            <Button variant="dark" size="xl" onClick={handlePlus} style={{margin: "2px"}}>+</Button>
          </div>
        </Card>
        </Col>

        <Col>
        <Card
        style={{
          marginLeft: "auto", marginRight: "auto", marginTop: "16px",
          boxShadow: "1px 4px 4px #e1e1e1", height: "20vh", justifyContent: "center",
          alignItems: "center", padding: "4px"
        }}>
            <Row>
              {trackedDigits.map((number, index) => (
                <Col>
                  <Card bg="primary" key={index}
                  style={{padding: "8px", color: "#fff", fontWeight: "bolder", fontSize: "1.5rem", textAlign: "center"}}>
                    {number}
                  </Card>
                </Col>
              ))}
            </Row>
            <Form>
              <Form.Check
                type="switch"
                id="track-switch"
                label="Track 2 digits"
                checked={doubleDigits}
                onChange={handleDigitChange}
              />
            </Form>
            <Button variant="dark" onClick={handleGenerateDigits} style={{margin: "4px"}}>New digits</Button>
        </Card>
        </Col>

        <Col>
        <Card
        style={{
          marginLeft: "auto", marginRight: "auto", marginTop: "16px",
          boxShadow: "1px 4px 4px #e1e1e1", height: "20vh", justifyContent: "center",
          alignItems: "center", padding: "4px"
        }}>
          <Row>
              <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Card.Title style={{fontSize: '0.75rem', textAlign: 'center'}}>Select speed:</Card.Title>
                <Card style={{height: '10vh', padding: '8px', alignItems: 'center', justifyContent: 'center'}}>
                  <Form.Check type="radio" label="Fast" name="speedOptions" onClick={handleSpeedFast}/>
                  <Form.Check type="radio" label="Medium" name="speedOptions" onClick={handleSpeedMedium} defaultChecked={true}/>
                  <Form.Check type="radio" label="Slow" name="speedOptions" onClick={handleSpeedSlow}/>
                </Card>
              </Col>
              <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Card.Title style={{fontSize: '0.75rem', textAlign: 'center'}}>Select range:</Card.Title>
                <Card style={{height: '10vh', padding: '8px', alignItems: 'center', justifyContent: 'center'}}>
                  <Form.Check type="radio" label="0-6" name="rangeOptions" onClick={handleAudioSix}/>
                  <Form.Check type="radio" label="0-10" name="rangeOptions" onClick={handleAudioTen} defaultChecked={true}/>
                </Card>
              </Col>
            </Row>
        </Card>
        </Col>

      </Row>

      <Card style={{ marginLeft: "20vw", marginRight: "20vw", marginTop: "16px", boxShadow: "1px 4px 4px #e1e1e1" }}>
        <Button variant={isPlaying? "danger" : "success"} size="xxl" onClick={handleStartStop}>
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reset trial data?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Warning: This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Reset data
          </Button>
        </Modal.Footer>
      </Modal>

      <Card style={{width: '98vw', margin: '1vw', boxShadow: "1px 4px 8px #e1e1e1"}}>
        <Card.Body>
          <Button variant="outline-dark" size="block" onClick={handleShow}>Reset</Button>
          <Card bg='primary' text="light" style={{width: '100%', boxShadow: "1px 4px 8px #e1e1e1", position: 'sticky', top: '0', zIndex: '1', height: '12vh'}}>
            <Card.Body>
              <Card.Title style={{display: 'flex', justifyContent: 'center'}}>Data</Card.Title>
              <div style={{marginBottom: '2px', display: 'flex', justifyContent: 'center'}}>
                <Button variant="warning" onClick={handleExport}>Export</Button>
              </div>
            </Card.Body>
          </Card>
          <Table striped bordered hover>
            <thead style={{position: 'sticky', top: '12vh', zIndex: '1'}}>
              <tr>
                <th>Trial #</th>
                <th>Number</th>
                <th>Tracked Digit 1</th>
                <th>Tracked Digit 2</th>
              </tr>
            </thead>
            <tbody>
              {listTrials.map((itemTrial, index) => {
                return (
                  <tr key={index} onClick={() => handleValid(itemTrial.id)}>
                    <td style={{
                      textDecoration : itemTrial.valid ? "none" : "line-through",
                      color : itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.trial}</td>
                    <td style={{
                      textDecoration : itemTrial.valid ? "none" : "line-through",
                      color : itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.number}</td>
                    <td style={{
                      textDecoration : itemTrial.valid ? "none" : "line-through",
                      color : itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.tracked_one}</td>
                    <td style={{
                      textDecoration : itemTrial.valid ? "none" : "line-through",
                      color : itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.tracked_two}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          </Card.Body>
      </Card>
    </>
  );
}

export default App;
