/* 관리자 보고서: 같은 브라우저에 저장된 퀴즈 기록을 읽고 통계를 계산합니다. */
const STORAGE_KEY='quizMasterRecords';
// HTML 요소를 ID로 찾습니다.
const el=id=>document.getElementById(id);
// 저장된 기록을 배열로 읽고 오류가 나면 빈 배열을 반환합니다.
function getRecords(){try{const records=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(records)?records:[];}catch(error){console.error('기록 불러오기 오류:',error);return [];}}
// ISO 날짜를 읽기 쉬운 한국어 날짜 형식으로 변환합니다.
function formatDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?'날짜 정보 없음':date.toLocaleString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});}
// 응시 횟수, 평균 점수, 평균 정답률과 최신순 기록 표를 표시합니다.
function displayReport(){const records=getRecords(),count=records.length;el('totalAttempts').textContent=`${count}회`;el('recordTable').replaceChildren();el('emptyMessage').classList.toggle('hidden',count!==0);el('deleteRecordsBtn').disabled=count===0;if(!count){el('averageScore').textContent='0점';el('averageAccuracy').textContent='0%';return;}const sumScore=records.reduce((sum,r)=>sum+Number(r.score||0),0),sumAccuracy=records.reduce((sum,r)=>sum+Number(r.accuracy||0),0);el('averageScore').textContent=`${(sumScore/count).toFixed(1)}점`;el('averageAccuracy').textContent=`${(sumAccuracy/count).toFixed(1)}%`;[...records].sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach(r=>{const tr=document.createElement('tr');[r.name,`${r.score}점`,`${r.correctCount} / ${r.totalQuestions}`,`${r.accuracy}%`,formatDate(r.date)].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.appendChild(td);});el('recordTable').appendChild(tr);});}
// 사용자에게 삭제 여부를 확인한 다음 이 퀴즈의 기록만 삭제합니다.
function deleteAllRecords(){if(!window.confirm('정말 이 브라우저의 모든 퀴즈 기록을 삭제하시겠습니까?\n삭제한 기록은 복구할 수 없습니다.'))return;try{localStorage.removeItem(STORAGE_KEY);displayReport();window.alert('퀴즈 응시 기록이 삭제되었습니다.');}catch(error){console.error('기록 삭제 오류:',error);window.alert('기록을 삭제하지 못했습니다.');}}
// 페이지를 열면 보고서를 출력하고 삭제 버튼을 연결합니다.
el('deleteRecordsBtn').addEventListener('click',deleteAllRecords);displayReport();
