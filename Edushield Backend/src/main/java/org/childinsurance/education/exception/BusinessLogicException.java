package org.childinsurance.education.exception;

/**
 * Exception thrown when business logic constraints are violated
 */
public class BusinessLogicException extends RuntimeException {
    private String errorCode;

    public BusinessLogicException(String message) {
        super(message);
    }

    public BusinessLogicException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessLogicException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}

