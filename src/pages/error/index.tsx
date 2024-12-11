import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  status?: number;
  message?: string
}

function Error(props: ErrorPageProps) {
  const { status = 404, message = 'Page not found' } = props
  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-8">
      <div className="flex justify-center items-center gap-2">
        <p className="h-3 mb-0">{status}</p>
        <p className="h-3 mb-0">{message}</p>
      </div>

      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Back to home
      </button>
    </div>
  )
}

export default Error