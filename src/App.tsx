import Main from "./Main"

import { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Main />
        </QueryClientProvider>
    )
}

export default App