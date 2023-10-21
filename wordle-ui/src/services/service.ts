import config from "@/config/config";

export default abstract class Service {
    protected abstract baseUrl: string;

    protected async get<T>(url: string): Promise<T> {
        const request = new Request(config.api.url + this.baseUrl + url);

        const response = await fetch(request)
        return response.json()
    }

    post() {

    }
}