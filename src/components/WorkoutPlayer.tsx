"use client";
import { useState, useEffect } from "react";

type Videos = { [key: string]: string };
type Exo = { nom: { [key: string]: string }; reps: string; consigne: { [key: string]: string }; videos: Videos; };

const TEXTES: any = {
  en: { langue: "Language :", precedent: "Previous", ecouter: "Listen", suivant: "Next", exercice: "Exercise", videoEn: "Video in" },
  fr: { langue: "Langue :", precedent: "Precedent", ecouter: "Ecouter", suivant: "Suivant", exercice: "Exercice", videoEn: "Video en" },
  es: { langue: "Idioma :", precedent: "Anterior", ecouter: "Escuchar", suivant: "Siguiente", exercice: "Ejercicio", videoEn: "Video en" },
  pt: { langue: "Lingua :", precedent: "Anterior", ecouter: "Ouvir", suivant: "Proximo", exercice: "Exercicio", videoEn: "Video em" },
  ar: { langue: "Language :", precedent: "Previous", ecouter: "Listen", suivant: "Next", exercice: "Exercise", videoEn: "Video in" },
  de: { langue: "Sprache :", precedent: "Zuruck", ecouter: "Horen", suivant: "Weiter", exercice: "Ubung", videoEn: "Video in" },
  it: { langue: "Lingua :", precedent: "Precedente", ecouter: "Ascolta", suivant: "Avanti", exercice: "Esercizio", videoEn: "Video in" },
};

const EXOS: Exo[] = [
  { nom: { en: "Push-ups", fr: "Pompes", es: "Flexiones", pt: "
