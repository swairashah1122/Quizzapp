// import React, { useState, useRef, useEffect } from 'react';
// import "./Quiz.css";
// import { data, shuffleData } from '../../Assets/data';

// const Quiz = () => {
//     let [index, setIndex] = useState(0);
//     let [questions, setQuestions] = useState([]);
//     let [question, setQuestion] = useState({});
//     let [lock, setLock] = useState(false);
//     let [score, setScore] = useState(0);
//     let [result, setResult] = useState(false);

//     let Option1 = useRef(null);
//     let Option2 = useRef(null);
//     let Option3 = useRef(null);
//     let Option4 = useRef(null);

//     let option_array = [Option1, Option2, Option3, Option4];

//     useEffect(() => {
//         const shuffledQuestions = shuffleData(data);
//         setQuestions(shuffledQuestions);
//         setQuestion(shuffledQuestions[0]);
//     }, []);

//     const checkAsk = (e, ans) => {
//         if (lock === false) {
//             if (question.ans === ans) {
//                 e.target.classList.add("correct");
//                 setLock(true);
//                 setScore(prev => prev + 1);
//             } else {
//                 e.target.classList.add("wrong");
//                 setLock(true);
//                 option_array[question.ans - 1].current.classList.add("correct");
//             }
//         }
//     }

//     const next = () => {
//         if (lock === true) {
//             if (index === questions.length - 1) {
//                 setResult(true);
//                 return 0;
//             }
//             setIndex(index + 1);
//             setQuestion(questions[index + 1]);
//             setLock(false);
//             option_array.forEach((option) => {
//                 option.current.classList.remove("wrong");
//                 option.current.classList.remove("correct");
//             });
//         }
//     }

//     const reset = () => {
//         const shuffledQuestions = shuffleData(data);
//         setQuestions(shuffledQuestions);
//         setIndex(0);
//         setQuestion(shuffledQuestions[0]);
//         setScore(0);
//         setLock(false);
//         setResult(false);
//     }

//     return (
//         <div className='container'>
//             <h1>Quiz App</h1>
//             <hr />
//             {result ? <></> : <>
//                 <h2>{index + 1}. {question.question}</h2>
//                 <ul>
//                     <li ref={Option1} onClick={(e) => { checkAsk(e, 1) }}>{question.option1}</li>
//                     <li ref={Option2} onClick={(e) => { checkAsk(e, 2) }}>{question.option2}</li>
//                     <li ref={Option3} onClick={(e) => { checkAsk(e, 3) }}>{question.option3}</li>
//                     <li ref={Option4} onClick={(e) => { checkAsk(e, 4) }}>{question.option4}</li>
//                 </ul>
//                 <button onClick={next}>Next</button>
//                 <div className="index">{index + 1} of {questions.length} questions</div>
//             </>}
//             {result ? <>
//                 <h2>You Scored {score} out of {questions.length}</h2>
//                 <button onClick={reset}>Reset</button>
//             </> : <></>}
//         </div>
//     );
// }

// export default Quiz;





























import React, { useState, useEffect, useRef } from 'react';
import "./Quiz.css";

const decodeHTML = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({});
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_array = [Option1, Option2, Option3, Option4];

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple'); // Category 18 is "Science: Computers"
            const data = await response.json();
            if (data.results) {
                const formattedQuestions = data.results.map((q) => {
                    const options = shuffleArray([
                        decodeHTML(q.correct_answer),
                        decodeHTML(q.incorrect_answers[0]),
                        decodeHTML(q.incorrect_answers[1]),
                        decodeHTML(q.incorrect_answers[2])
                    ]);

                    return {
                        question: decodeHTML(q.question),
                        options,
                        ans: options.indexOf(decodeHTML(q.correct_answer)) + 1, // Correct answer index
                    };
                });

                setQuestions(formattedQuestions);
                setQuestion(formattedQuestions[0]);
            } else {
                console.error('No results found');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const checkAsk = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setLock(true);
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("correct");
            }
        }
    }

    const next = () => {
        if (lock) {
            if (index === questions.length - 1) {
                setResult(true);
                return;
            }
            setIndex(index + 1);
            setQuestion(questions[index + 1]);
            setLock(false);
            option_array.forEach((option) => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            });
        }
    }

    const reset = () => {
        fetchQuestions();
        setIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
    }

    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <hr />
            {result ? null : (
                <>
                    <h2>{index + 1}. {question.question}</h2>
                    <ul>
                        <li ref={Option1} onClick={(e) => checkAsk(e, 1)}>{question.options && question.options[0]}</li>
                        <li ref={Option2} onClick={(e) => checkAsk(e, 2)}>{question.options && question.options[1]}</li>
                        <li ref={Option3} onClick={(e) => checkAsk(e, 3)}>{question.options && question.options[2]}</li>
                        <li ref={Option4} onClick={(e) => checkAsk(e, 4)}>{question.options && question.options[3]}</li>
                    </ul>
                    <button onClick={next}>Next</button>
                    <div className="index">{index + 1} of {questions.length} questions</div>
                </>
            )}
            {result ? (
                <>
                    <h2>You Scored {score} out of {questions.length}</h2>
                    <button onClick={reset}>Reset</button>
                </>
            ) : null}
        </div>
    );
}

export default Quiz;
