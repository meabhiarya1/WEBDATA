// resultGeneratorWorker.js

self.onmessage = (e) => {
  let count = 0;
  const {
    dataHeaders,
    keyHEaders,
    mappedKey,
    subjectWiseMarking,
    ctx,
    headers,
  } = e.data;
  // let headers = [];
  let finalAnswers = [];

  for (let i = 1; i < dataHeaders.length; i++) {
    //we will go to each student attempted question in data file
    if (i % 15 === 0) {
      self.postMessage({
        type: "progress",
        processedData: i,
      });
    }

    let startpoint = +ctx.paperMarkings.start;

    let endPoint = +startpoint + +ctx.paperMarkings.end - 1;

    let CorrectAnswer = 0;
    let WrongAnswer = 0;
    let NotAttempted = 0;

    let correctPoint = +ctx.paperMarkings.correctPoint;

    let wrongPoint = +ctx.paperMarkings.wrongPoint;

    let subjectHEaderPushCount = 1;
    let validMappedKey = false;
    for (let j = 1; j < keyHEaders.length; j++) {
      //we will try to find mapped key in key file so that student attempted paper Question in data file will be  matched with student targeted keys file
      if (dataHeaders[i][mappedKey] == keyHEaders[j][mappedKey]) {
        validMappedKey = true;
        // after getting the mapped answerkey  in keyData file now we will run our logic to find correct and wrong answer calculation
        let currentIndex = 0;
        let AllOutPutHeaders = {};

        while (currentIndex < keyHEaders[0].length) {
          let currentHeaders = keyHEaders[0][currentIndex];
          AllOutPutHeaders = {
            ...AllOutPutHeaders,
            [currentHeaders]: dataHeaders[i][currentHeaders],
          };

          currentIndex++;
        }

        if (subjectWiseMarking.length > 0) {
          // console.log(subjectWiseMarking,"sbmarking")
          //here we will run a loop for each subject which we selects during result generation
          let studentData = {};
          let allSubjectTotal = 0;
          for (let k = 0; k < subjectWiseMarking.length; k++) {
      
            if (i == 1 && subjectHEaderPushCount == 1) {
              headers.push(
                `${subjectWiseMarking[k].subject}_notAttempted`,
                `${subjectWiseMarking[k].subject}_Correct`,
                `${subjectWiseMarking[k].subject}_wrongAnswer`,
                `${subjectWiseMarking[k].subject}_total`
              );
            }

            startpoint = +subjectWiseMarking[k].start;
            endPoint = +subjectWiseMarking[k].end;
            CorrectAnswer = 0;
            WrongAnswer = 0;
            NotAttempted = 0;

            let subjectTotal = 0;
            while (startpoint <= endPoint) {
              let currentHeaders = keyHEaders[0][startpoint];

              if (
                dataHeaders[i][currentHeaders] == "" ||
                keyHEaders[j][currentHeaders] == ""
              ) {
                NotAttempted++;
              } else if (
                keyHEaders[j][currentHeaders] == dataHeaders[i][currentHeaders]
              ) {
                CorrectAnswer++;
              } else if (
                keyHEaders[j][currentHeaders] != dataHeaders[i][currentHeaders]
              ) {
                WrongAnswer++;
              }

              startpoint++;
            }
            subjectTotal =
              CorrectAnswer * +subjectWiseMarking[k].correctPoint -
              +WrongAnswer * +subjectWiseMarking[k].wrongPoint;
            allSubjectTotal += subjectTotal;
            studentData = {
              ...studentData,
              [`${subjectWiseMarking[k].subject}_notAttempted`]: NotAttempted,
              [`${subjectWiseMarking[k].subject}_Correct`]: CorrectAnswer,
              [`${subjectWiseMarking[k].subject}_wrongAnswer`]: WrongAnswer,
              [`${subjectWiseMarking[k].subject}_total`]: subjectTotal,
              total: allSubjectTotal,
            };
          }
          subjectHEaderPushCount++;
          finalAnswers.push({ ...studentData, ...AllOutPutHeaders });

          // finalAnswers.push(studentData);
        } else {
          while (startpoint <= endPoint) {
            let currentHeaders = keyHEaders[0][startpoint];
            if (dataHeaders[i][currentHeaders] == "") {
              NotAttempted++;
            } else if (
              keyHEaders[j][currentHeaders] == dataHeaders[i][currentHeaders]
            ) {
              CorrectAnswer++;
            } else if (
              keyHEaders[j][currentHeaders] != dataHeaders[i][currentHeaders]
            ) {
              WrongAnswer++;
            } else {
            }
            //     console.log(dataHeaders[0], dataHeaders[i][currentHeaders]);
            startpoint++;
          }
          // return;
          finalAnswers.push({
            ...AllOutPutHeaders,

            notAttempted: NotAttempted,
            wrongAnswer: WrongAnswer,
            correctAnswer: CorrectAnswer,
            total_Score:
              CorrectAnswer * correctPoint - WrongAnswer * wrongPoint,
            remark: "ok",
          });
        }

        break;
      } else {
      }
    }
    if (!validMappedKey) {
      //if we will not find any student apper key matches with keyHEaders then we will return the currennt student without calculating result but we will add a remark
      const studentObj = {
        ...dataHeaders[i],
        remark: "mapped key not match",
      };
      finalAnswers.push(studentObj);
    }
  }

  self.postMessage({ type: "result", headersData: headers, finalAnswers });
};
