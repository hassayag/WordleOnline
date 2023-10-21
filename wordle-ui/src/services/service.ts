import config from '@/config/config';

export default abstract class Service {
    protected abstract baseUrl: string;

    protected async get<T>(url: string, useCreds = true): Promise<T> {
        let request: Request;
        if (useCreds) {
            request = new Request(config.api.url + this.baseUrl + url, {
                credentials: 'include',
            });
        } else {
            request = new Request(config.api.url + this.baseUrl + url);
        }

        const response = await fetch(request);
        return this.catchResponseError(response)
    }

    protected async post<T>(url: string, payload: any): Promise<T> {
        const request = new Request(config.api.url + this.baseUrl + url, {
            credentials: 'include',
        });

        const response = await fetch(request, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        });

        return this.catchResponseError(response)
    }

    protected async patch<T>(url: string, payload: any): Promise<T> {
        const request = new Request(config.api.url + this.baseUrl + url, {
            credentials: 'include',
        });

        const response = await fetch(request, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        });

        return this.catchResponseError(response)
    }

    protected async delete<T = void>(url: string): Promise<T> {
        const request = new Request(config.api.url + this.baseUrl + url, {
            credentials: 'include',
        });

        const response = await fetch(request, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        return this.catchResponseError(response)
    }

    private async catchResponseError(response: Response) {
        const json = await response.json();
        
        if (!response.ok) {
            const error = {
                status: response.status,
                message: json.message,
            };
            throw error;
        }

        return json;
    }
}
