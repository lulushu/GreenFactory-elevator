# GreenFactory elevator (ES5 + jQuery + underscore)

DEMO: https://htmlpreview.github.io/?https://github.com/lulushu/GreenFactory-elevator/blob/master/index.html

## Elevator API   
  
### - activateButton() Function  
**Description**: 입력한 층의 버튼을 활성화 시킨다.
    
 **Syntax**: `activateButton( targetFloor )`
 
  **Parameter**
  - `targetFloor`  
*Type: Integer      
Description: 버튼을 활성화 하려는 층의 숫자 ( 범위 : 1 ~ 생성된 층수 )*    
  
 **Returns**: undefined  
  
**Example**:   
```js 
activateButton(4); 
```    

### - isButtonActivated() Function      
  
**Description**: 입력한 층의 버튼이 활성화됐는지 여부를 리턴한다.
    
**Syntax**:  `isButtonActivated( targetFloor )`    

**Parameter**
- `targetFloor`  
*Type: Integer      
Description: 버튼의 활성화를 확인하려는 층의 숫자 ( 범위 : 1 ~ 생성된 층수 )*    
  
**Returns**: Boolean    
  
**Example**:  
```js 
isButtonActivated(4);  //return true or false  
```