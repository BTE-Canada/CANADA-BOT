from types import FunctionType

class NotFunctionError(Exception): 
    def __init__(self, calling, message):
        self.calling = calling 
        self.message = message 
    """
    calling: expression that caused the error 
    message: outputed explanation message on raise 
    """
class Function:
    def __init__(self, fun : FunctionType): 
        if not isinstance(fun, FunctionType): raise NotFunctionError(fun, "This is not a valid function. The function class creates objects through lambda functions.") 
        self.fun = fun 
    def numerical_integration(self, lower_bound: int, superior_bound: int, rectangle_count=100)->float: 
        base = (superior_bound-lower_bound)/rectangle_count 
        total_area = 0 
        lower_x = lower_bound  
        for _ in range(rectangle_count): 
            x = lower_x + (base/2)
            total_area += self.fun(x) * base 
            lower_x += base # shifting the lower bound towards the right 
        return total_area 

a = Function(lambda x: x**2)


