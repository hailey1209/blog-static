const scroller = new Scroller(false)

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')
  const footer = document.querySelector('.footer')

  const title = document.querySelector('.post-container .post-title input') // 추가
  const postContents = document.querySelector('.post-container .post-contents') // 추가
  const tagInput = document.querySelector('.post-container .post-tags input') // 추가

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')

    title.classList.toggle('dark') // 추가 
    postContents.classList.toggle('dark') // 추가
    tagInput.classList.toggle('dark') // 추가 
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  // 태그 입력 기능
  const tagList = document.querySelector('.post-container .post-tags ul')
  const tagsLimit = 10 //테그 개수 제한
  const tegLangth = 10 //테그 글자수 제한

  tagInput.addEventListener('keyup', function(event){
    console.log(this)
    console.log('태그 입력 중...', event.key,tagInput.value)

    const trimTag = this.value.trim() //글자 양쪽에 공백 제거
    if(event.key === 'Enter' && trimTag !== '' && trimTag.length <= tegLangth && tagList.children.length <=tagsLimit){
      const tag = document.createElement('li')
      tag.innerHTML = `#${trimTag}<a href="#">x</a>`
      tagList.appendChild(tag)
      this.value = '' //입력창 초기화
    }
  })

  //태그 삭제 기능 (이벤트 위임)
  tagList.addEventListener('click', function(event){
    console.log(event.target, event.target.parentElement, event.target.hasAttribute('href'))

    event.preventDefault()
    if(event.target.hasAttribute('href')){
        tagList.removeChild(event.target.parentElement)
    }
  })

  //파일 입력 처리
  let lastCaretLine = null //caret : cursor (커서 위치의 엘리먼트)
  const uploadInput = document.querySelector('.upload input')
  uploadInput.addEventListener('change', function(event){
    const files = this.files
    console.log(files)

    if(files.length > 0){
        for(const file of files){
            const fileType = file.type
            console.log(fileType)

            if(fileType.includes('image')){
                console.log('image')
                const img = document.createElement('img')
                img.src = URL.createObjectURL(file) //파일의 임시경로 생성
                //편집기의 마지막 커서위치에 파일 추가
                lastCaretLine = addFileToCurrentLine(lastCaretLine, img)

            }else if(fileType.includes('video')){
                console.log('video')
            }else if(fileType.includes('audio')){
                console.log('audio')
            }else{
                console.log('file')
            }
        }

        //커서 위치를 맨 마지막으로 추가한 파일 아래쪽에 보여주기
        //사용자가 드래그로 선택한 범위
        const selection =document.getSelection()
        selection.removeAllRanges()

        //해당 엘리먼트를 범위로 지정
        const range = document.createRange()
        range.selectNodeContents(lastCaretLine)
        range.collapse() //범위가 아니라 커서 지정
        selection.addRange(range) //새로운 범위 설정
        postContents.focus() //편집기에 커서 보여주기
    }
  })
  postContents.addEventListener('blur', function(event){
    //편집기가 블러될때 마지막 커서 위치에있는 엘리먼트
    lastCaretLine = document.getSelection().anchorNode
    console.log(lastCaretLine.parentNode, lastCaretLine, lastCaretLine.length)
    
  })
})
// 공백라인(공백 엘리먼트) 생성
function createNewLine(){
    const newLine = document.createElement('div')
    newLine.innerHTML = `<br />`
    return newLine
}

function addFileToCurrentLine(line, file){
    console.log(line.nodeType)  //nodeType = 3이면 텍스트 노드
    if(line.nodeType ===3){
        line =line.parentNode //
    }
    line.insertAdjacentElement('afterend', createNewLine())
    line.nextSibling.insertAdjacentElement('afterbegin', file)
    line.nextSibling.insertAdjacentElement('afterend', createNewLine())
    return line.nextSibling.nextSibling //파일 하단에 위치한 공백라인
}
