/* 학생용 퀴즈: 시작 → 문제 표시 → 채점 → 결과 → 브라우저 기록 저장 */
const STORAGE_KEY='quizMasterRecords';
// 화면 요소를 ID로 간편하게 찾습니다.
const el=id=>document.getElementById(id);
// 현재 게임의 진행 상태입니다.
let playerName='',gameQuestions=[],currentIndex=0,score=0,correctCount=0,answered=false,categoryStats={};
// 지정한 화면 하나만 보여 줍니다.
function showScreen(id){['startScreen','quizScreen','resultScreen'].forEach(x=>el(x).classList.toggle('hidden',x!==id));}
// 원본을 수정하지 않고 문제 순서를 무작위로 섞습니다.
function shuffleQuestions(items){const arr=[...items];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
// 이름을 검사하고 점수와 카테고리별 통계를 초기화합니다.
function startGame(){const name=el('playerName').value.trim();if(!name){el('nameError').textContent='이름 또는 별명을 입력해 주세요.';el('playerName').focus();return;}if(typeof QUIZ_QUESTIONS==='undefined'||!QUIZ_QUESTIONS.length){el('nameError').textContent='등록된 문제가 없습니다.';return;}el('nameError').textContent='';playerName=name;gameQuestions=shuffleQuestions(QUIZ_QUESTIONS);currentIndex=0;score=0;correctCount=0;answered=false;categoryStats={};gameQuestions.forEach(q=>{if(!categoryStats[q.category])categoryStats[q.category]={total:0,correct:0};categoryStats[q.category].total++;});showScreen('quizScreen');displayQuestion();}
// 진행률 막대를 변경합니다.
function setProgress(percent){el('progressBar').style.width=percent+'%';document.querySelector('.progress-track').setAttribute('aria-valuenow',Math.round(percent));}
// 현재 문제와 네 개의 선택지를 버튼으로 만듭니다.
function displayQuestion(){answered=false;const q=gameQuestions[currentIndex];el('questionNumber').textContent=`문제 ${currentIndex+1} / ${gameQuestions.length}`;el('currentScore').textContent=`${score}점`;setProgress(currentIndex/gameQuestions.length*100);el('categoryBadge').textContent=q.category;el('questionText').textContent=q.question;const box=el('optionsContainer');box.replaceChildren();q.options.forEach((option,index)=>{const btn=document.createElement('button');btn.className='option-btn';btn.textContent=`${index+1}. ${option}`;btn.addEventListener('click',()=>checkAnswer(index));box.appendChild(btn);});el('feedback').className='feedback hidden';el('feedbackTitle').textContent='';el('explanationText').textContent='';el('nextBtn').classList.add('hidden');}
// 한 번만 채점하고 정답은 초록색, 선택한 오답은 빨간색으로 표시합니다.
function checkAnswer(selected){if(answered)return;answered=true;const q=gameQuestions[currentIndex],right=selected===q.correctAnswer;if(right){score+=10;correctCount++;categoryStats[q.category].correct++;el('feedbackTitle').textContent='정답입니다! +10점';el('feedback').className='feedback success';}else{el('feedbackTitle').textContent='아쉬워요! 오답입니다.';el('feedback').className='feedback failure';}el('currentScore').textContent=`${score}점`;el('optionsContainer').querySelectorAll('button').forEach((btn,index)=>{btn.disabled=true;if(index===q.correctAnswer)btn.classList.add('correct');if(index===selected&&!right)btn.classList.add('wrong');});el('explanationText').textContent=q.explanation;el('nextBtn').classList.remove('hidden');el('nextBtn').textContent=currentIndex===gameQuestions.length-1?'최종 결과 확인 →':'다음 문제 →';setProgress((currentIndex+1)/gameQuestions.length*100);}
// 남은 문제가 없으면 최종 결과 화면으로 이동합니다.
function nextQuestion(){if(!answered)return;currentIndex++;if(currentIndex<gameQuestions.length)displayQuestion();else finishGame();}
// 게임 기록을 기존 기록 배열 끝에 추가합니다.
function saveRecord(record){try{const old=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');const records=Array.isArray(old)?old:[];records.push(record);localStorage.setItem(STORAGE_KEY,JSON.stringify(records));return true;}catch(error){console.error('기록 저장 실패:',error);return false;}}
// 점수, 정답률, 카테고리별 결과를 표시하고 자동 저장합니다.
function finishGame(){const total=gameQuestions.length,accuracy=Math.round(correctCount/total*100);showScreen('resultScreen');el('resultName').textContent=`${playerName}님의 퀴즈 결과`;el('finalScore').textContent=score;el('finalCorrect').textContent=`${correctCount} / ${total}`;el('finalAccuracy').textContent=`${accuracy}%`;const box=el('categoryResults');box.replaceChildren();Object.entries(categoryStats).forEach(([category,stats])=>{const row=document.createElement('div'),name=document.createElement('span'),result=document.createElement('strong');row.className='category-row';name.textContent=category;result.textContent=`${stats.correct} / ${stats.total}문제`;row.append(name,result);box.appendChild(row);});const saved=saveRecord({name:playerName,date:new Date().toISOString(),score,correctCount,totalQuestions:total,accuracy,categoryStats});el('saveStatus').textContent=saved?'✓ 게임 기록이 이 브라우저에 저장되었습니다.':'기록을 저장하지 못했습니다. 브라우저 저장 설정을 확인해 주세요.';}
// 다시 시작하면 이전 기록은 유지하고 입력 화면으로 돌아갑니다.
function restartGame(){playerName='';gameQuestions=[];currentIndex=0;score=0;correctCount=0;answered=false;categoryStats={};el('playerName').value='';el('nameError').textContent='';showScreen('startScreen');el('playerName').focus();}
// 버튼과 엔터 키에 기능을 연결합니다.
el('startBtn').addEventListener('click',startGame);el('playerName').addEventListener('keydown',e=>{if(e.key==='Enter')startGame();});el('nextBtn').addEventListener('click',nextQuestion);el('restartBtn').addEventListener('click',restartGame);
