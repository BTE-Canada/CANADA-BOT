from types import FunctionType
from typing import Type
from numpy import array
from sympy import symbols, lambdify, diff, integrate
from sympy.functions.elementary.complexes import re
from sympy.parsing.sympy_parser import parse_expr

from re import search, split, sub

class NotFunctionError(Exception): 
    ERR_NOT_FUN_INPUT = """This is not a valid way to input a function.
            Please check that you are using a variable with a single letter (ex: 'x') and that you are only using the following operators: [+,-,/,*,^,(,)] """
    def __init__(self, calling, message):
        self.calling = calling 
        self.message = message 
    """
    calling: expression that caused the error 
    message: outputed explanation message on raise 
    """
    # if not isinstance(fun, FunctionType): raise NotFunctionError(fun, "This is not a valid function. The function class creates objects through python functions.") 
class Function:
    x = symbols('x')  # The symbol we'll use for all the calculations  
    @staticmethod 
    def transform_into_expression(function_string):
        if "=" in function_string: return None # We are assuming y = [x expression] form 
        basic_operations = ['/', '*', '-', '+', '^']
        match_obj_var = search(r"[^\s\+\-\/\*\^1-9]", function_string) 
        if match_obj_var is None: return None 
        var = match_obj_var.group(0) 
        # Now, checking if another variable is present
        for _ in function_string: 
            if not _.isnumeric() and _ not in basic_operations and _!=var: return None
        str_list = list(function_string) 
        for i, char in enumerate(str_list): # Now check to the left and right if there is a digit without operator 
            if char == var:
                if i == 0: 
                    if str_list[1].isnumeric(): str_list.insert(1, "*") 
                elif i == len(str_list)-1: 
                    if str_list[len(str_list)-2].isnumeric(): str_list.insert(len(str_list)-1, "*")  
                else: 
                    if str_list[i-1].isnumeric(): str_list.insert(i, "*")
                    if str_list[i+1].isnumeric(): str_list.insert(i, "*")          
        expr = "".join(str_list)
        if "xx" in expr: # if the person inputted something like 3xxx+4, it -> 3*xxx+4. I couldn't manage to make it work with the loop, so I'll just brute force it
            equivalences = [("x*"*n)[:-1] for n in range(2,7)]
            expr_l = split(r"[+-/*\s]", expr)
            for element in expr_l: 
                if "xx" in element: 
                    for degree in range(2,7): 
                        if "x"*degree in element: 
                            expr = expr.replace("x"*degree, equivalences[degree-2])
        if "^" in expr: expr = sub("\^", "**", expr)
        return expr                  

    def __init__(self, fun : str):  # Default creation is with 'standard' form, ex: "4x + 45-4x^2"
        f = Function.transform_into_expression(fun)
        if f is None: raise NotFunctionError(str, NotFunctionError.ERR_NOT_FUN_INPUT)
        self.fun = parse_expr(f)
        
    #TODO ADD OPTIONAL DECORATOR FOR NON SIMPLIFIED FUNCTIONS, WITH AN "="
    def numerical_integration_rectangles(self, lower_bound:int = 0, superior_bound:int =10, rectangle_count=100)->float: 
        base = (superior_bound-lower_bound)/rectangle_count 
        total_area = 0 
        lower_x = lower_bound  
        for _ in range(rectangle_count): 
            x = lower_x + (base/2)
            total_area += self.fun.subs(self.x, x) * base 
            lower_x += base # shifting the lower bound towards the right 
        return total_area 

    def eval_integral(self, numerical=True, lower_bound: int = 0, superior_bound:int = 10):
        if numerical: return integrate(self.fun, (self.x, lower_bound, superior_bound))
        return integrate(self.fun, self.x) 

    def eval_derivative(self, x: float=0, numerical=True, order:int=1)->float: 
        if numerical: 
            return diff(self.fun, self.x, int(order)).subs(self.x, x) 
        return diff(self.fun, self.x, int(order))
    
    def calculate_outputs(self, abs: array = array([n for n in range(0, 110, 10)]))->dict: # Calculates outputs for the function
        try: 
              # returns a dict showing the x's and associated y's 
            return dict(zip(abs, lambdify(self.x, self.fun, "numpy")(abs)))
        except TypeError: 
            return {"Error": """Please input a list of the X values to compute. Ex: "[0, 20, 40]"}"""} 
        
a = Function("3x")  
print(a.eval_integral(True, 0, 10))   
