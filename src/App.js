import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

function App() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState({});
  const [value, setValue] = useState('');
  const [musicTarget, setMusicTarget] = useState(null);
  const [correct, setCorrect] = useState(undefined);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const locationKey = urlSearchParams.get('l') || 'cn';
  const eventKey = urlSearchParams.get('e') || 'hn';
  const questionKey = urlSearchParams.get('q');

  useEffect(() => {
    fetch(`data/events/${locationKey}-${eventKey}.json`)
      .then(response => response.json())
      .then(data => {
        setQuestion(data.questions[questionKey].question);
        setAnswer(data.questions[questionKey].answer);
      })
      .finally(() => setLoading(false));
  }, [locationKey, eventKey, questionKey]);

  useEffect(() => {
    if (correct && musicTarget) {
      if (answer.musicId) {
        musicTarget.loadVideoById(answer.musicId);
      }
      musicTarget.playVideo();
    }
  }, [correct, answer, musicTarget]);

  function handleReady(event) {
    setMusicTarget(event.target);
  }

  function handleFocus () {
    if (musicTarget) musicTarget.playVideo();
  }

  function handleChange (event) {
    setValue(event.target.value);

    if (musicTarget) musicTarget.playVideo();
  }

  function handleSubmit (event) {
    event.preventDefault();
    
    const regexp = new RegExp(answer.regexp, 'i');
    const correct = regexp.test(value);

    setCorrect(correct);
  }

  return (
    <div className="App" onClick={handleFocus}>
      <div className="block block-question block-transparent">
        <div className="block-foreground">
          {loading ? (
            <div className="spinner-grow" role="status">
              <span className="visually-hidden">Loading&hellip;</span>
            </div>
          ) : (
            <h1 className="display-1" dangerouslySetInnerHTML={{__html: correct ? answer.value : question.html || question.text}} />
          )}
        </div>

        <div className="block-background block-background-a" />
        <div className="block-background block-background-b" />
        <div className="block-background block-background-c" />

        {correct && answer.img ? (
          <div className="block-background block-background-answer" style={{backgroundImage: `url(img/events/${eventKey}/${answer.img})`}} />
        ) : null}
      </div>

      <div className="block block-answer" style={{backgroundColor: 'var(--bs-black)'}}>
        <div className="block-xs-middle">
          <div className="block-foreground">
            {loading ? (
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading&hellip;</span>
              </div>
            ) : correct ? (
              <h2 className="display-2 text-success">Correct!</h2>
            ) : (
              <form className="needs-validation p-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="value" className="form-label visually-hidden">Answer</label>
                  <input type="text" className={`form-control form-control-lg ${correct === false ? 'is-invalid' : null}`} id="value" value={value} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            )}
          </div>
        </div>

        <div className="block-background block-background-a" />
        <div className="block-background block-background-b" />
        <div className="block-background block-background-c" />
      </div>

      {!loading && (question.musicId || answer.musicId) ? (
        <YouTube
          videoId={correct ? answer.musicId || question.musicId || '' : question.musicId || ''}
          opts={{
            playerVars: {
              autoplay: 1
            }
          }}
          className="visually-hidden"
          onReady={handleReady}
        />
      ) : null}

      <div className="block-background block-background-a" />
      <div className="block-background block-background-b" />
      <div className="block-background block-background-c" />
    </div>
  );
}

export default App;
