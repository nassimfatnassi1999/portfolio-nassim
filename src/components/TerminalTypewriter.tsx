import { useState, useEffect } from 'react';

type TerminalTypewriterProps = {
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
    onComplete?: () => void;
    showCursor?: boolean;
};

export function TerminalTypewriter({
    text,
    delay = 0,
    speed = 50,
    className = '',
    onComplete,
    showCursor = true,
}: TerminalTypewriterProps) {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTyping(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!isTyping) return;

        if (displayText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(text.slice(0, displayText.length + 1));
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            setIsComplete(true);
            if (onComplete) onComplete();
        }
    }, [displayText, isTyping, text, speed, onComplete]);

    if (!isTyping) return null;

    return (
        <span className={`${className} font-mono`}>
            {displayText}
            {showCursor && !isComplete && (
                <span className="animate-pulse inline-block w-2 h-4 bg-gray-400 ml-1 align-middle" />
            )}
        </span>
    );
}
