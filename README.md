# Elevator  api document  
  
## activateButton( targetFloor )  
  
**Description**: 입력한 층의 버튼을 활성화 시킨다.  
  
- **targetFloor**    
Type: Integer    
버튼을 활성화 하려는 층의 숫자 ( 범위 1 ~ 생성된 층수 )  

- **Returns**: undefined

Example: 
```js  
activateButton(4);  
```  
  
## isButtonActivated( targetFloor )  
  
**Description**: 입력한 층의 버튼이 활성화됐는지 여부를 리턴한다.  

- **targetFloor**    
Type: Integer    
버튼의 활성화를 확인하려 층의 숫자 ( 범위 1 ~ 생성된 층수 )  

- **Returns**: Boolean  

Example:
```js  
isButtonActivated(4);  //return true of false
```