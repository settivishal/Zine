// import className from 'classnames';

const Button = (props) => {
  const btnClass ="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
  const combinedClass = `${btnClass} ${props.className || ''}${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  const { onClick, children, disabled, ...restProps } = props;
  return (
    <button className={combinedClass} onClick= {onClick}
      {...(disabled !== undefined ? { disabled } : {})}
      {...restProps}
    > 
      {props.children}

      <style jsx>
        {`
          .btn {
            @apply inline-block rounded-md text-center;
          }

          .btn-base {
            @apply text-lg font-semibold py-2 px-4;
          }

          .btn-xl {
            @apply font-extrabold text-xl py-4 px-6;
          }

          .btn-primary {
            @apply text-white bg-primary-500;
          }

          .btn-primary:hover {
            @apply bg-primary-600;
          }
        `}
      </style>
    </button>
  );
};

export default Button;
