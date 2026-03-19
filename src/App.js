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
import num1En from './audio/en/1.mp3'
import num2En from './audio/en/2.mp3'
import num3En from './audio/en/3.mp3'
import num4En from './audio/en/4.mp3'
import num5En from './audio/en/5.mp3'
import num6En from './audio/en/6.mp3'
import num7En from './audio/en/7.mp3'
import num8En from './audio/en/8.mp3'
import num9En from './audio/en/9.mp3'
import num10En from './audio/en/10.mp3'

import num1Nl from './audio/nl/1.mp3'
import num2Nl from './audio/nl/2.mp3'
import num3Nl from './audio/nl/3.mp3'
import num4Nl from './audio/nl/4.mp3'
import num5Nl from './audio/nl/5.mp3'
import num6Nl from './audio/nl/6.mp3'
import num7Nl from './audio/nl/7.mp3'
import num8Nl from './audio/nl/8.mp3'
import num9Nl from './audio/nl/9.mp3'
import num10Nl from './audio/nl/10.mp3'


import { useState, useEffect, useRef, useCallback } from 'react';

const audioSources = {
  en: [num1En, num2En, num3En, num4En, num5En, num6En, num7En, num8En, num9En, num10En],
  nl: [num1Nl, num2Nl, num3Nl, num4Nl, num5Nl, num6Nl, num7Nl, num8Nl, num9Nl, num10Nl],
};

function App() {
  const [language, setLanguage] = useState(() => JSON.parse(window.localStorage.getItem('LANGUAGE_DIGITMONITOR')) || 'en');
  const [range, setRange] = useState(() => JSON.parse(window.localStorage.getItem('RANGE_DIGITMONITOR')) || 10);
  const [listAudio, setListAudio] = useState([]);

  useEffect(() => {
    const sources = audioSources[language].slice(0, range);
    const audios = sources.map(src => new Audio(src));
    setListAudio(audios);
  }, [language, range]);

  const [show, setShow] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [doubleDigits, setDoubleDigits] = useState(() => JSON.parse(window.localStorage.getItem('DOUBLE_DIGITMONITOR')) ?? true);
  const [trackedDigits, setTrackedDigits] = useState(() => JSON.parse(window.localStorage.getItem('TRACKED_DIGITMONITOR')) || [1, 7]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [intervalLimits, setIntervalLimits] = useState(() => JSON.parse(window.localStorage.getItem('INTERVAL_DIGITMONITOR')) || [500, 1500]);
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
    window.localStorage.setItem('LANGUAGE_DIGITMONITOR', JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem('RANGE_DIGITMONITOR', JSON.stringify(range));
  }, [range]);

  useEffect(() => {
    window.localStorage.setItem('DOUBLE_DIGITMONITOR', JSON.stringify(doubleDigits));
  }, [doubleDigits]);

  useEffect(() => {
    window.localStorage.setItem('INTERVAL_DIGITMONITOR', JSON.stringify(intervalLimits));
  }, [intervalLimits]);

  useEffect(() => {
    window.localStorage.setItem('TRACKED_DIGITMONITOR', JSON.stringify(trackedDigits));
  }, [trackedDigits]);


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
            number: randomNumber + 1,
            time_unix: String(unix),
            time: String(unix.toISOString()),
            tracked_one: trackedOne,
            tracked_two: trackedTwo,
            valid: true
          };
          setListTrials([dictTrial, ...listTrials])
        }
      },
      Math.random() * (intervalLimits[1] - intervalLimits[0]) + intervalLimits[0]
    ); // Random interval between 500ms and 1500ms

    return () => clearInterval(intervalId);
  }, [isPlaying, listAudio, intervalLimits, randomNumber, listTrials, trialCount, doubleDigits, trackedDigits]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    handleGenerateDigits();
  }, [doubleDigits, range, handleGenerateDigits])



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
    setRange(6);
  }
  function handleAudioTen() {
    setRange(10);
  }
  function handleLanguageEn() {
    setLanguage('en');
  }
  function handleLanguageNl() {
    setLanguage('nl');
  }

  const handleGenerateDigits = useCallback(() => {
    if (listAudio.length === 0) return;
    let newDigits;
    if (doubleDigits) {
      newDigits = [Math.floor(Math.random() * listAudio.length / 2) + 1,
      Math.floor(Math.random() * listAudio.length / 2 + listAudio.length / 2) + 1];
    } else {
      newDigits = [Math.floor(Math.random() * listAudio.length) + 1];
    }
    setTrackedDigits(newDigits);
  }, [listAudio, doubleDigits]);


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
        ("0" + (m.getMonth() + 1)).slice(-2) + "-" +
        ("0" + m.getDate()).slice(-2) + "_" +
        ("0" + m.getHours()).slice(-2) + "-" +
        ("0" + m.getMinutes()).slice(-2) + "-" +
        ("0" + m.getSeconds()).slice(-2);
      var blob = new Blob([convertToCSV(listTrials)], { type: "text/plain;charset=utf-8" });
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
  const handleCloseAbout = () => setShowAbout(false);
  const handleShowAbout = () => setShowAbout(true);
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
        <Container className="justify-content-end">
          <Navbar.Text style={{ fontSize: '0.85rem' }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleShowAbout}>About & Credits</span>
          </Navbar.Text>
        </Container>
      </Navbar>

      <Row style={{ marginLeft: "5vw", marginRight: "5vw" }}>
        <Col style={{ alignItems: "stretch" }}>
          <Card
            style={{
              marginLeft: "auto", marginRight: "auto", marginTop: "16px",
              boxShadow: "1px 4px 4px #e1e1e1", height: "20vh", justifyContent: "center",
              alignItems: "center", padding: "4px"
            }}>
            <Card.Title style={{ fontSize: "1.5rem" }}>Trial #{trialCount}</Card.Title>
            <div style={{ display: 'flex', flexDirection: 'row', margin: '16px' }}>
              <Button variant="dark" size="xl" onClick={handleMinus} style={{ margin: "2px" }}>-</Button>
              <Button variant="dark" size="xl" onClick={handlePlus} style={{ margin: "2px" }}>+</Button>
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
                    style={{ padding: "8px", color: "#fff", fontWeight: "bolder", fontSize: "1.5rem", textAlign: "center" }}>
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
            <Button variant="dark" onClick={handleGenerateDigits} style={{ margin: "4px" }}>New digits</Button>
          </Card>
        </Col>

        <Col xl={6}>
          <Card
            style={{
              marginLeft: "auto", marginRight: "auto", marginTop: "16px",
              boxShadow: "1px 4px 4px #e1e1e1", minHeight: "20vh", height: '100%', justifyContent: "center",
              alignItems: "center", padding: "8px"
            }}>
            <Row style={{ width: '100%' }}>
              <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'stretch' }}>
                <Card.Title style={{ fontSize: '0.85rem', textAlign: 'center', marginBottom: '8px' }}>Select speed:</Card.Title>
                <Card style={{ minHeight: '10vh', height: '100%', padding: '12px 8px', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="Fast (250-1000ms)" name="speedOptions" onChange={handleSpeedFast} checked={intervalLimits[0] === 250} />
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="Medium (500-1500ms)" name="speedOptions" onChange={handleSpeedMedium} checked={intervalLimits[0] === 500} />
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="Slow (1000-2500ms)" name="speedOptions" onChange={handleSpeedSlow} checked={intervalLimits[0] === 1000} />
                </Card>
              </Col>
              <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'stretch' }}>
                <Card.Title style={{ fontSize: '0.85rem', textAlign: 'center', marginBottom: '8px' }}>Select range:</Card.Title>
                <Card style={{ minHeight: '10vh', height: '100%', padding: '12px 8px', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="1-6" name="rangeOptions" onChange={handleAudioSix} checked={range === 6} />
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="1-10" name="rangeOptions" onChange={handleAudioTen} checked={range === 10} />
                </Card>
              </Col>
              <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'stretch' }}>
                <Card.Title style={{ fontSize: '0.85rem', textAlign: 'center', marginBottom: '8px' }}>Language:</Card.Title>
                <Card style={{ minHeight: '10vh', height: '100%', padding: '12px 8px', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="English" name="langOptions" onChange={handleLanguageEn} checked={language === 'en'} />
                  <Form.Check style={{ fontSize: '0.85rem' }} type="radio" label="Dutch" name="langOptions" onChange={handleLanguageNl} checked={language === 'nl'} />
                </Card>
              </Col>

            </Row>
          </Card>
        </Col>


      </Row>

      <Card style={{ marginLeft: "20vw", marginRight: "20vw", marginTop: "16px", boxShadow: "1px 4px 4px #e1e1e1" }}>
        <Button variant={isPlaying ? "danger" : "success"} size="xxl" onClick={handleStartStop}>
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

      <Modal show={showAbout} onHide={handleCloseAbout}>
        <Modal.Header closeButton>
          <Modal.Title>About & Credits</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Developed By</strong><br />
            Abdullah Zafar <a href="https://orcid.org/0000-0002-7872-7715" target="_blank" rel="noreferrer">(ORCID: 0000-0002-7872-7715)</a>
          </p>
          <p>
            <strong>Source Code</strong><br />
            <a href="https://github.com/neurocog-mobility/app-digit-monitor" target="_blank" rel="noreferrer">github.com/neurocog-mobility/app-digit-monitor</a>
          </p>
          <hr />
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
            Task adapted from: <br />
            <a href="https://doi.org/10.1007/s00221-024-06800-3" target="_blank" rel="noreferrer">
              Norouzian et al. (2024). doi:10.1007/s00221-024-06800-3
            </a>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAbout}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Card style={{ width: '98vw', margin: '1vw', boxShadow: "1px 4px 8px #e1e1e1" }}>
        <Card.Body>
          <Button variant="outline-dark" size="block" onClick={handleShow}>Reset</Button>
          <Card bg='primary' text="light" style={{ width: '100%', boxShadow: "1px 4px 8px #e1e1e1", position: 'sticky', top: '0', zIndex: '1', height: '12vh' }}>
            <Card.Body>
              <Card.Title style={{ display: 'flex', justifyContent: 'center' }}>Data</Card.Title>
              <div style={{ marginBottom: '2px', display: 'flex', justifyContent: 'center' }}>
                <Button variant="warning" onClick={handleExport}>Export</Button>
              </div>
            </Card.Body>
          </Card>
          <Table striped bordered hover>
            <thead style={{ position: 'sticky', top: '12vh', zIndex: '1' }}>
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
                      textDecoration: itemTrial.valid ? "none" : "line-through",
                      color: itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.trial}</td>
                    <td style={{
                      textDecoration: itemTrial.valid ? "none" : "line-through",
                      color: itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.number}</td>
                    <td style={{
                      textDecoration: itemTrial.valid ? "none" : "line-through",
                      color: itemTrial.valid ? "black" : "red",
                    }}>{itemTrial.tracked_one}</td>
                    <td style={{
                      textDecoration: itemTrial.valid ? "none" : "line-through",
                      color: itemTrial.valid ? "black" : "red",
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
