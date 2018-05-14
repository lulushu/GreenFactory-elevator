# Elevator  api document  
    
## ElevatorController( elevatorNumber, floorNumber )
  
**Description**: Elevator의 method들을 사용하기 위해서는 우선 ElevatorController의 instance를 생성하여 variable, 혹은 property에 해당 instance를 대입해야 한다.  
  
- **elevatorNumber**    
Type: Integer    
생성하고자 하는 엘리베이터의 개수 ( 허용 범위 2~4 개 )  
  
- **floorNumber**    
Type: Integer    
생성하고자 하는 층수 ( 허용 범위 2~5 층 )  
    
    
**Examples:**  
```js  
var Elevator = new ElevatorController(4,5);  
```
  
## .activateButton( targetFloorNumber )  
  
**Description**: ElevatorController instance의 method로, 입력한 층의 버튼을 활성화 시킨다.

- **Returns**: undefined
  
- **targetFloorNumber**    
Type: Integer    
버튼을 활성화 하려는 층의 숫자 ( 범위 1 ~ 생성된 층수 )  
 
```js  
var Elevator = new ElevatorController(4,5);  
Elevator.activateButton(4);  
```  
  
## .isButtonActivated( targetFloorNumber )  
  
**Description**: ElevatorController instance의 method로, 입력한 층의 버튼이 활성화됐는지 여부를 리턴한다.  
  
- **Returns**: Boolean  

- **targetFloorNumber**    
Type: Integer    
버튼의 활성화를 확인하려 층의 숫자 ( 범위 1 ~ 생성된 층수 )  

```js  
var Elevator = new ElevatorController(4,5);  
Elevator.isButtonActivated(4);  //return true of false
  
```