from enhanced_capabilities.code_support import is_code_question, handle_code_question, extract_code, guess_language

# Test cases for code support
test_questions = [
    "Can you explain this code: ```python\ndef fibonacci(n):\n    a, b = 0, 1\n    for i in range(n):\n        a, b = b, a + b\n    return a\n```",
    "Fix this Python code: ```\ndef factorial(n)\n    if n == 0\n        return 1\n    else\n        return n * factorial(n-1)\n```",
    "Generate a function to check if a number is prime",
    "How do I fetch data from an API in JavaScript?",
    "What's wrong with this HTML? <h1>Hello World</h2>"
]

def test_code_support():
    print("Testing code support...\n")
    for question in test_questions:
        print(f"Question: {question}")
        print(f"Is code question? {is_code_question(question)}")
        
        # For debugging: extract code and guess language
        code_blocks = extract_code(question)
        if code_blocks:
            lang, code = code_blocks[0]
            guessed_lang = guess_language(code) if not lang else lang
            print(f"Extracted code blocks: {len(code_blocks)}")
            print(f"Guessed language: {guessed_lang}")
        
        try:
            result = handle_code_question(question)
            print(f"Answer type: {result.get('type', 'unknown')}")
            print(f"Answer: {result.get('answer', 'No answer')}")
            
            if result.get("type") == "fix" and "fixed_code" in result:
                print(f"Fixed code available: Yes")
                print(f"Fixed code:\n{result['fixed_code']}")
                
            if "explanation" in result:
                print(f"Explanation available: Yes")
                print(f"Explanation:\n{result['explanation']}")
                
            if result.get("type") == "generate" and "code" in result:
                print(f"Generated code language: {result.get('language', 'unknown')}")
                print(f"Generated code:\n{result.get('code', '')}")
            
        except Exception as e:
            print(f"Error: {e}")
        print("=" * 50)

if __name__ == "__main__":
    test_code_support()