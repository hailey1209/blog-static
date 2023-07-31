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
  postContents.focus()//첫 로딩때 커서 보이기
  postContents.insertAdjacentElement("afterbegin", createNewLine())//포스트 편집기 내부의 첫번째줄을 생성
  let lastCaretLine = postContents.firstChild //caret : cursor (커서 위치의 엘리먼트)
  const uploadInput = document.querySelector('.upload input')
  uploadInput.addEventListener('change', function(event){
    const files = this.files
    console.log(files)

    if(files.length > 0){
        for(const file of files){
            const fileType = file.type
            console.log(fileType)

            if(fileType.includes('image')){ //이미지 파일 프리뷰 보여주기
                console.log('image')
                const img= bulidMediaElement(img, {src: URL.createObjectURL(file)})
                //편집기의 마지막 커서위치에 파일 추가
                lastCaretLine = addFileToCurrentLine(lastCaretLine, img)

            }else if(fileType.includes('video')){  // 비디오 파일 프리뷰 보여주기
                console.log('video')
                const video = bulidMediaElement(video, {
                                                className: video-name, 
                                                controls: true, 
                                                src: URL.createObjectURL(file)})
                lastCaretLine = addFileToCurrentLine(lastCaretLine, video)

            }else if(fileType.includes('audio')){ //오디오 파일 프리뷰
                console.log('audio')
                const audio = bulidMediaElement(audio, {
                                                className: audio-file, 
                                                controls: true, 
                                                src: URL.createObjectURL(file)})
                lastCaretLine = addFileToCurrentLine(lastCaretLine, audio)
            }else{ //파일 프리뷰 
                console.log('file', file.name, file.size)
                const div = bulidMediaElement(div, {
                                              className: normal-file,
                                              contentEditable: false,
                                              innerHTML: `
                                              <div class="file-icon">
                                                <span class="material-icons">folder</span>
                                              </div>
                                              <div class="file-info">
                                                <h3>${getFileName(file.name, 70)}</h3>
                                                <p>${getFileSize(file.size)}</p>
                                              </div>`
                })
                lastCaretLine = addFileToCurrentLine(lastCaretLine, div) //에디터에 파일 추가 및 파일이 추가될때마다 커서위치 업데이트하기
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

  // 텍스트 포멧
  const textTool = document.querySelector('.text-tool')
  const colorbox = document.querySelectorAll('.text-tool .color-box')
  const fontBox =document.querySelector('.text-tool .font-box')

  textTool.addEventListener('click', function(e){
    e.stopPropagation() //document 클릭 이벤트와 충돌하지 않도록 설정
    console.log(e.target)
    switch(e.target.innerText){
      case 'format_bold':
        changeTextFormat('bold') //사용자가 선택한 텍스트가 볼드체로 변경
        break
      case 'format_italic':
        changeTextFormat('italic')
        break
      case'format_underlined':
      changeTextFormat('underline')
        break
      case 'format_strikethrough':
        changeTextFormat('strikeThrough')
        break
      case 'format_color_text':
        changeTextFormat('foreColor', 'orange')
        hideDropdown(textTool, 'format_color_text')
        colorbox[0].classList.toggle('show')
        break
      case 'format_color_fill':
        changeTextFormat('backColor', 'black')
        hideDropdown(textTool, 'format_color_fill')
        colorbox[1].classList.toggle('show')
        break
      case 'format_size':
        changeTextFormat('fontSize', 7)
        hideDropdown(textTool, 'format_size')
        fontBox.classList.toggle('show')
        break
    }
    postContents.focus({preventScroll: true}) //커서 설정
  })

  // 텍스트 정렬
  const alignTool = document.querySelector('.align-tool')
  alignTool.addEventListener('click', function(e){
    console.log(e.target.innerText)
    switch(e.target.innerText){
      case 'format_align_left':
        changeTextFormat('justifyLeft')
        break
      case 'format_align_center':
        changeTextFormat('justifyCenter')
        break
      case 'format_align_right':
        changeTextFormat('justifyRight')
        break
      case 'format_align_justify':
        changeTextFormat('justifyFull')
        break
    }
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

// 
function getFileName(name, limit){
  console.log(name.slice(0,limit))
  // conslog.log(name.lastIndexOf('.'), name.length)
  return name.length > limit ? 
  `${name.slice(0,limit)}...${name.lastIndexOf('.'), name.length}`
  : name
}

// number: 파일 용량(bytes)
function getFileSize(number){
  if(number < 1024){
    return number + 'bytes'  //바이트
  }else if(number >= 1024 && number < 1048576){
    return (number/1024).toFixed(1) + 'KB'  //키로바이트
  }else if(number >= 1048576){
    return (number/1048576).toFixed(1) + 'MB'  //메가바이트
  }
}

// options = {className: 'audio', controls: 'true'}, 파일 업로드 기능 기본 함수
function bulidMediaElement(tag, options){
  const mediaElement = document.createElement(tag)
  for(const option of options){ //생성한 엘리먼트에 속성을 설정
    mediaElement[option] = options[option]
  }
  return mediaElement
}

function changeTextFormat(style, param){
  console.log(style)
  document.execCommand(style, false, param)
}

function hideDropdown(toolbox, currentDropdown){
  //현재 텍스트툴 요소 안쪽에서 열려있는 드롭다운 메뉴 조회
  const dropdown = toolbox.querySelector('.select-menu-dropdown.show')
  if(dropdown && dropdown.parentElement.querySelector('a span').innerText !== currentDropdown ){
    dropdown.classList.remove('show')
    console.log(currentDropdown)
    console.log(dropdown.parentElement)
  }
}

document.addEventListener('click', function(e){
  //현재 열려있는 드롭다운 조회
  const dropdown = document.querySelector('.select-menu-dropdown.show')
  if(dropdown && !dropdown.contains(e.target)){
    dropdown.classList.remove('show')
  }
})