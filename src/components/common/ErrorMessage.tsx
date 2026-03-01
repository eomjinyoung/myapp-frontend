interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm my-4">
            {message}
        </div>
    );
}
