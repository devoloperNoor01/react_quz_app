import _ from 'lodash';
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useAnswers from "../../hooks/useAnswers";
import Analysis from "../Analysis";
import Summary from "../Summary";

export default function Result() {
  const [userScore, setUserScore] = useState()
  const { id } = useParams();
  const { state } = useLocation();

  const { loading, error, answers } = useAnswers(id);
  useEffect(()=>{
      function calculate() {
        let score = 0;
    
        answers.forEach((question, index1) => {
          let correctIndexes = [],
            checkedIndexes = [];
    
          question.options.forEach((option, index2) => {
            if (option.correct) correctIndexes.push(index2);
            if (state[index1].options[index2].checked) {
              checkedIndexes.push(index2);
              option.checked = true;
            }
          });
    
          if (_.isEqual(correctIndexes, checkedIndexes)) {
            score = score + 5;
          }
        });
    
        return score;
      }
    
      setUserScore(calculate())
  },[state, answers])


  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>There was an error!</div>}

      {answers && answers.length > 0 && (
        <>
          <Summary score={userScore} noq={answers.length} />
          <Analysis answers={answers} />
        </>
      )}
    </>
  );
}