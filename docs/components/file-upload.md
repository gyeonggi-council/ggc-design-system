# 파일 업로드 — `.ggc-file` · `.ggc-file-list`

선택 버튼 + 끌어놓기 영역 + 선택한 파일 목록(이름 · 크기 · 삭제). input 은 시각적으로만 숨긴다 —
`Tab` 으로 도달하고 `Enter`/`Space` 로 열린다.

## 마크업

```html
<div class="ggc-field">
  <label for="f1">첨부 문서</label>
  <div class="ggc-file" data-ggc-file data-ggc-file-max="5">
    <div class="drop">
      <label class="cta" for="f1">
        <input id="f1" type="file" multiple accept=".hwp,.hwpx,.pdf" aria-describedby="f1-h">
        <span class="ggc-btn ggc-btn--secondary ggc-btn--sm">파일 선택</span>
        <span class="or">또는 여기에 끌어놓기</span>
      </label>
      <span class="rule" id="f1-h">HWP · HWPX · PDF, 파일당 20MB 까지, 최대 5개</span>
    </div>
    <ul class="ggc-file-list" aria-label="선택한 파일"></ul>
  </div>
</div>
```

목록 항목(`ggc-behaviors.js` 가 만든다 — 서버에 이미 올린 파일도 같은 모양으로 그린다):

```html
<li><span class="name">검토보고서.hwpx</span><span class="size">184KB</span>
    <button class="remove" type="button" aria-label="검토보고서.hwpx 삭제">✕</button></li>
<li class="is-error"><span class="name">비용추계서.xlsx</span><span class="size">2.1MB</span>
    <button class="remove" type="button" aria-label="비용추계서.xlsx 삭제">✕</button>
    <span class="error">허용되지 않는 형식이다 — HWP · PDF 만</span></li>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 끌어놓는 중 | `.drop[data-over]` — JS 가 붙인다 |
| 한 줄형 | `--compact` (표 안 · 좁은 폼) |
| 항목 오류 | `li.is-error` + `.error` 문구 |
| 개수 상한 | `data-ggc-file-max` — 넘는 것은 무시한다(문구로 미리 알린다) |

## 동작 (`data-ggc-file`)

`change` · `drop` 마다 목록을 다시 그리고, 삭제한 파일을 `input.files` 에 되돌린다(DataTransfer). 폼 전송이 목록과 같다.
`ggc:files` 이벤트(`detail.files`)로 서비스가 크기·형식 검증을 얹는다. JS 가 없으면 브라우저 기본 문구("파일 n개")가 보인다 — 깨지지 않는다.

## 규칙

- 허용 형식 · 크기 · 개수를 **미리** 적는다(`.rule` + `aria-describedby`). 올린 뒤에 거절하지 않는다.
- 삭제 버튼 이름에 파일명을 넣는다 — "삭제" 만 다섯 개면 스크린리더가 구분 못 한다.
- `accept` 는 힌트일 뿐이다. 서버에서 형식·크기를 다시 검증한다.
- 업로드 진행 중은 항목에 `.ggc-spinner--sm` + `aria-busy`. 완료 뒤 크기를 서버 값으로 바꾼다.

## 프로필

`.cta` 글자 `--ggc-control-font`, 버튼 `--ggc-control-h-sm`.

## Tier 2

`ggc-file-upload` (Phase 9b).

## 근거

KRDS `file_upload` · §28.
