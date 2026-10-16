<?php

return [
    'required' => ':Attribute må fylles ut.',
    'string' => ':Attribute må være tekst.',
    'email' => ':Attribute må være en gyldig e-postadresse.',
    'integer' => ':Attribute må være et heltall.',
    'in' => 'Det valgte alternativet for :attribute er ugyldig.',
    'not_in' => 'Det valgte alternativet for :attribute er ugyldig.',
    'accepted' => ':Attribute må godtas.',
    'confirmed' => 'Bekreftelsen av :attribute stemmer ikke.',
    'date' => ':Attribute må være en gyldig dato.',
    'before' => ':Attribute må være en dato før :date.',
    'unique' => ':Attribute er allerede i bruk.',
    'min' => ['numeric' => ':Attribute må være minst :min.', 'string' => ':Attribute må ha minst :min tegn.'],
    'max' => ['numeric' => ':Attribute kan ikke være større enn :max.', 'string' => ':Attribute kan ha høyst :max tegn.'],
    'password' => ['letters' => ':Attribute må inneholde minst én bokstav.', 'numbers' => ':Attribute må inneholde minst ett tall.'],
    'attributes' => ['name' => 'fornavn', 'surname' => 'etternavn', 'email' => 'e-postadresse', 'password' => 'passord', 'phone' => 'telefonnummer', 'dob' => 'fødselsdato', 'street' => 'gateadresse', 'city' => 'by', 'country' => 'land', 'post_code' => 'postnummer', 'terms' => 'vilkår', 'custom_credits' => 'antall kreditter', 'locale' => 'språk', 'currency' => 'valuta', 'gateway' => 'betalingsmåte', 'package_id' => 'kredittpakke'],
];
