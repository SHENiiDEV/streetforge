<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:filter', 'max:255', Rule::unique('users')->ignore($this->user())],
            'current_password' => [Rule::excludeIf($this->input('email') === $this->user()->email), 'required', 'string', 'current_password:web'],
            'phone' => ['required', 'string', 'max:30'],
            'street' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', Rule::in(array_keys(config('countries')))],
            'post_code' => ['required', 'string', 'max:20'],
        ];
    }
}
