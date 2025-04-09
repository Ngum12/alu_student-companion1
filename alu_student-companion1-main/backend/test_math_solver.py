from enhanced_capabilities.math_solver import solve_math_with_sympy

# More comprehensive test cases
test_questions = [
    "What is 345 + 567?",
    "Solve for x: 3x - 7 = 20",
    "Simplify (x^2 + 3x - 10) / (x - 2)",
    "Factor x^2 - 9",
    "Expand (x + 3)(x - 2)",
    "Integrate x^2 + 3x with respect to x",
    "Find the derivative of x^3 - 5x^2 + 2x"
]

def test_math_solver():
    print("Testing math solver with complex expressions...\n")
    for question in test_questions:
        print(f"Question: {question}")
        try:
            result = solve_math_with_sympy(question)
            print(f"Answer: {result.get('answer', 'No answer')}")
            print(f"Steps: {result.get('steps', [])}")
        except Exception as e:
            print(f"Error: {e}")
        print("=" * 50)

if __name__ == "__main__":
    test_math_solver()